import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const CalmHomeHubApp());
}

class CalmHomeHubApp extends StatelessWidget {
  const CalmHomeHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Calm Home Hub',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        // Deliberately muted, wood-and-paper palette — the app should feel
        // quiet, not app-like, echoing mui Board's "invisible until touched"
        // design philosophy.
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF8B6F47),
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF5F1EA),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
