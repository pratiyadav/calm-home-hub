import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

// Point this at your backend — use 10.0.2.2 instead of localhost when
// running on the Android emulator.
const String backendUrl = 'http://localhost:4000/api';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> _devices = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDevices();
  }

  Future<void> _loadDevices() async {
    try {
      final response = await http.get(Uri.parse('$backendUrl/devices'));
      if (response.statusCode == 200) {
        setState(() {
          _devices = jsonDecode(response.body);
          _loading = false;
        });
      }
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  Future<void> _toggleDevice(String id, bool turnOn) async {
    await http.post(
      Uri.parse('$backendUrl/devices/$id/commands'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'action': turnOn ? 'TURN_ON' : 'TURN_OFF'}),
    );
    _loadDevices();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _devices.isEmpty
                ? const Center(
                    child: Text(
                      'No devices yet.\nStart the simulator to see one appear.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.black38),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(24),
                    itemCount: _devices.length,
                    itemBuilder: (context, index) {
                      final device = _devices[index];
                      return _DeviceTile(
                        name: device['name'],
                        room: device['room'],
                        isOn: device['isOn'],
                        onToggle: (value) => _toggleDevice(device['id'], value),
                      );
                    },
                  ),
      ),
    );
  }
}

/// A single row that stays visually quiet until interacted with —
/// no shadows, no bright colors, just enough to be legible.
class _DeviceTile extends StatelessWidget {
  final String name;
  final String room;
  final bool isOn;
  final ValueChanged<bool> onToggle;

  const _DeviceTile({
    required this.name,
    required this.room,
    required this.isOn,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.6),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontSize: 16)),
                Text(room,
                    style: const TextStyle(fontSize: 12, color: Colors.black45)),
              ],
            ),
          ),
          Switch(value: isOn, onChanged: onToggle),
        ],
      ),
    );
  }
}
