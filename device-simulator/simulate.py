"""
Calm Home Hub — device simulator

Simulates a single mui-Board-style wooden IoT device:
  - registers itself with the cloud backend on startup
  - periodically reports sensor telemetry (temperature, light, presence)
  - polls for pending commands (e.g. TURN_ON / TURN_OFF) and "executes" them
    by printing to the console — swap this for real GPIO/relay code on
    a Raspberry Pi to control an actual light or switch.

Usage:
    pip install -r requirements.txt
    python simulate.py
"""

import random
import time
import requests

BACKEND_URL = "http://localhost:4000/api"
DEVICE_ID = "living-room-panel-01"
DEVICE_NAME = "Living Room Panel"
DEVICE_ROOM = "Living Room"
POLL_INTERVAL_SECONDS = 5


def register_device() -> None:
    resp = requests.post(
        f"{BACKEND_URL}/devices",
        json={"id": DEVICE_ID, "name": DEVICE_NAME, "room": DEVICE_ROOM},
        timeout=5,
    )
    resp.raise_for_status()
    print(f"[registered] {DEVICE_NAME} ({DEVICE_ID})")


def report_telemetry() -> None:
    reading = {
        "temperatureC": round(random.uniform(22.0, 30.0), 1),
        "lightLevel": random.randint(0, 100),
        "presence": random.random() > 0.5,
    }
    resp = requests.post(
        f"{BACKEND_URL}/devices/{DEVICE_ID}/telemetry", json=reading, timeout=5
    )
    resp.raise_for_status()
    print(f"[telemetry] sent {reading}")


def poll_commands() -> None:
    resp = requests.get(f"{BACKEND_URL}/devices/{DEVICE_ID}/commands", timeout=5)
    resp.raise_for_status()
    commands = resp.json()
    for command in commands:
        execute_command(command)


def execute_command(command: dict) -> None:
    action = command.get("action")
    # This is where real hardware control would happen (GPIO/relay toggle).
    if action == "TURN_ON":
        print("[command] turning panel display/light ON")
    elif action == "TURN_OFF":
        print("[command] turning panel display/light OFF")
    elif action == "SET_SCENE":
        print(f"[command] applying scene: {command.get('payload')}")
    else:
        print(f"[command] unknown action: {action}")


def main() -> None:
    register_device()
    while True:
        report_telemetry()
        poll_commands()
        time.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    main()
