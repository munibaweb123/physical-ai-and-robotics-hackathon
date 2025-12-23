---
sidebar_position: 4
title: Cloud vs Local
---

# Cloud vs. Local Lab

If you cannot afford the Workstation (CapEx), you can rent one in the cloud (OpEx).

:::danger The Latency Trap
**Do NOT attempt to control a real balancing robot from a cloud instance.**
The latency over the internet (>20ms) exceeds the control loop requirements (1-5ms) for dynamic balance.
**Solution**: Train in the Cloud -> Download Model -> Deploy to Local Edge Kit.
:::

## The "Ether Lab" (Cloud Native)

Using AWS or Azure to run Isaac Sim.

### Cost Calculation (AWS g5.2xlarge)

| Item | Cost/Unit | Weekly Est (10hrs) | Quarterly Est (12 wks) |
|------|-----------|--------------------|------------------------|
| **Compute** | ~$1.50/hr | $15.00 | $180.00 |
| **Storage** | ~$25/mo | - | $75.00 |
| **Total** | | | **~$255.00** |

*Note: Prices vary by region and spot instance availability.*

### Workflow

1. **Spin up** AWS g5.2xlarge instance (NVIDIA A10G, 24GB VRAM).
2. **Install** Omniverse & Isaac Sim (Headless or Streaming).
3. **Train** your policy.
4. **Export** weights (`.onnx` or `.pth`).
5. **SCP** weights to your local Jetson Nano.
