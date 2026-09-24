# Notes: Adapting Calm Home Hub for the Indian Market

Rough product-thinking notes, written in the spirit of the "specification
discussions for the future Indian market" part of mui Lab's internship
description. Not implemented — a starting point for discussion.

- **Voltage fluctuation awareness**: Indian households see more frequent
  brownouts than Japan. Telemetry could flag abnormal voltage/power-cycling
  patterns on a connected device rather than silently losing state.
- **Connectivity assumptions**: Wi-Fi drop-outs are more common; the device
  simulator's poll-based command model (rather than a persistent socket)
  is deliberately chosen as a more resilient fallback pattern for
  intermittent connectivity, similar to patterns used in India-focused IoT
  deployments.
- **Multi-lingual, script-light UI**: mui Board's pixel-text interface would
  need either multi-script font support or a shift toward icon/gesture-first
  interaction for households where English/Japanese text isn't the norm.
- **Joint-family usage patterns**: Automations (e.g. "goodnight" scenes)
  may need per-room rather than per-home scope, since Indian homes more
  often have multiple family units under one roof with different routines.
- **Price-sensitive rollout**: a phased hardware rollout (starting with the
  wall panel only, sensors added later) may suit price-sensitive early
  adopters better than an all-at-once bundle.

These are hypotheses, not conclusions — the kind of thing worth validating
with real user research, which is presumably part of what this internship's
"technical validation" work involves.
