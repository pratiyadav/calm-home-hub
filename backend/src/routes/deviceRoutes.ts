import { Router, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { deviceStore, Command } from '../models/Device';

export const deviceRoutes = Router();

// Register or update a device (called once by the simulator/app on startup)
deviceRoutes.post('/devices', (req: Request, res: Response) => {
  const { id, name, room } = req.body;
  if (!id || !name || !room) {
    return res.status(400).json({ error: 'id, name, and room are required' });
  }
  const device = deviceStore.upsertDevice({
    id,
    name,
    room,
    isOn: false,
    lastSeenAt: new Date().toISOString(),
    telemetry: {},
  });
  res.status(201).json(device);
});

// List all devices — this is what the mobile app polls/subscribes to
deviceRoutes.get('/devices', (_req: Request, res: Response) => {
  res.json(deviceStore.listDevices());
});

// Device pushes sensor readings up to the cloud
deviceRoutes.post('/devices/:id/telemetry', (req: Request, res: Response) => {
  const updated = deviceStore.updateTelemetry(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'device not found' });
  res.json(updated);
});

// Mobile app queues a command for a device (e.g. turn on light)
deviceRoutes.post('/devices/:id/commands', (req: Request, res: Response) => {
  const { action, payload } = req.body;
  const device = deviceStore.getDevice(req.params.id);
  if (!device) return res.status(404).json({ error: 'device not found' });

  const command: Command = {
    id: uuid(),
    deviceId: req.params.id,
    action,
    payload,
    createdAt: new Date().toISOString(),
    delivered: false,
  };
  deviceStore.queueCommand(command);

  if (action === 'TURN_ON') device.isOn = true;
  if (action === 'TURN_OFF') device.isOn = false;

  res.status(202).json(command);
});

// Device polls for commands waiting for it (simple long-poll alternative to MQTT)
deviceRoutes.get('/devices/:id/commands', (req: Request, res: Response) => {
  const commands = deviceStore.drainCommands(req.params.id);
  res.json(commands);
});
