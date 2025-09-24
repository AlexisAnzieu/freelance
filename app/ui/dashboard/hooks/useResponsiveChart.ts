"use client";

import { useState, useEffect } from "react";

export function useResponsiveChart() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getResponsiveOptions = (baseOptions: Record<string, any>) => ({
    ...baseOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        ...baseOptions.plugins?.legend,
        position: isMobile
          ? ("bottom" as const)
          : baseOptions.plugins?.legend?.position || ("top" as const),
        labels: {
          ...baseOptions.plugins?.legend?.labels,
          font: {
            size: isMobile ? 10 : 12,
          },
          padding: isMobile ? 10 : 20,
          usePointStyle: true,
        },
      },
      title: {
        ...baseOptions.plugins?.title,
        font: {
          size: isMobile ? 12 : 16,
          weight: "bold" as const,
        },
        padding: {
          top: isMobile ? 10 : 20,
          bottom: isMobile ? 15 : 20,
        },
      },
      tooltip: {
        ...baseOptions.plugins?.tooltip,
        titleFont: {
          size: isMobile ? 11 : 13,
        },
        bodyFont: {
          size: isMobile ? 10 : 12,
        },
        padding: isMobile ? 6 : 10,
      },
    },
    scales: baseOptions.scales
      ? {
          ...Object.keys(baseOptions.scales).reduce(
            (acc, key) => ({
              ...acc,
              [key]: {
                ...baseOptions.scales[key],
                title: {
                  ...baseOptions.scales[key].title,
                  font: {
                    size: isMobile ? 10 : 12,
                  },
                },
                ticks: {
                  ...baseOptions.scales[key].ticks,
                  font: {
                    size: isMobile ? 9 : 11,
                  },
                  maxTicksLimit: isMobile ? 6 : 10,
                },
              },
            }),
            {}
          ),
        }
      : undefined,
    elements: {
      ...baseOptions.elements,
      point: {
        ...baseOptions.elements?.point,
        radius: isMobile ? 2 : 3,
        hoverRadius: isMobile ? 4 : 6,
      },
      line: {
        ...baseOptions.elements?.line,
        borderWidth: isMobile ? 1.5 : 2,
      },
    },
  });

  return { isMobile, getResponsiveOptions };
}
