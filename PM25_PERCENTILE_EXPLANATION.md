# PM2.5 Percentile Explanation

## What is PM2.5 Percentile?

**PM2.5 Percentile** (`EPL_PM`) is a normalized ranking value that shows where each hexagon's PM2.5 pollution level ranks compared to all other hexagons in the dataset.

## Scale: 0 to 1

- **0.0** = Lowest PM2.5 (best air quality relative to dataset)
- **0.5** = Median PM2.5 (middle of the distribution)
- **1.0** = Highest PM2.5 (worst air quality relative to dataset)

## Example Values

From your data:
- `EPL_PM: 0.6784` → This hexagon has PM2.5 worse than **67.84%** of all hexagons
- `EPL_PM: 0.5265` → This hexagon has PM2.5 worse than **52.65%** of all hexagons (slightly above median)
- `EPL_PM: 0.0681` → This hexagon has PM2.5 worse than only **6.81%** of all hexagons (very good!)

## PM2.5 Percentile vs. Absolute PM2.5

| Measure | Field Name | Units | What It Shows |
|---------|------------|-------|---------------|
| **Absolute PM2.5** | `E_PM` | μg/m³ | Actual pollution concentration (e.g., 8.13 μg/m³) |
| **PM2.5 Percentile** | `EPL_PM` | 0–1 | Relative ranking compared to all hexagons (e.g., 0.6784 = 67.84th percentile) |

## Why Use Percentiles?

1. **Relative Comparison**: Shows how one area compares to all other areas in your dataset
2. **Normalized Scale**: Easier to compare with other percentile-based metrics
3. **Identifying Extremes**: Quickly identify areas in top/bottom percentiles

## Interpretation

- **Low percentile (0.0–0.2)**: Better air quality relative to the dataset
- **Medium percentile (0.4–0.6)**: Average air quality relative to the dataset  
- **High percentile (0.8–1.0)**: Worse air quality relative to the dataset

**Note**: This is a **relative ranking** within your dataset, not an absolute EPA standard. An area with a high percentile (0.9) might still have "Good" air quality by EPA standards if the entire dataset has low pollution levels.

