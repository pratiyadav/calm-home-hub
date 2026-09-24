// In-memory device store for local dev.
// Swap this module for a DynamoDB-backed repository when deploying to AWS —
// see docs in README for the AWS IoT Core + DynamoDB upgrade path.

export interface Device {
  id: string;
  name: string;
  room: string;
  isOn: boolean;
  lastSeenAt: string;
  telemetry: {
    temperatureC?: number;
    lightLevel?: number;
    presence?: boolean;
  };
}

export interface Command {
  id: string;
  deviceId: string;
  action: 'TURN_ON' | 'TURN_OFF' | 'SET_SCENE';
  payload?: Record<string, unknown>;
  createdAt: string;
  delivered: boolean;
}

class DeviceStore {
  private devices = new Map<string, Device>();
  private pendingCommands = new Map<string, Command[]>();

  upsertDevice(device: Device): Device {
    this.devices.set(device.id, device);
    return device;
  }

  getDevice(id: string): Device | undefined {
    return this.devices.get(id);
  }

  listDevices(): Device[] {
    return Array.from(this.devices.values());
  }

  updateTelemetry(id: string, telemetry: Device['telemetry']): Device | undefined {
    const device = this.devices.get(id);
    if (!device) return undefined;
    device.telemetry = { ...device.telemetry, ...telemetry };
    device.lastSeenAt = new Date().toISOString();
    return device;
  }

  queueCommand(command: Command): void {
    const existing = this.pendingCommands.get(command.deviceId) ?? [];
    existing.push(command);
    this.pendingCommands.set(command.deviceId, existing);
  }

  drainCommands(deviceId: string): Command[] {
    const commands = this.pendingCommands.get(deviceId) ?? [];
    this.pendingCommands.set(deviceId, []);
    return commands;
  }
}

export const deviceStore = new DeviceStore();
