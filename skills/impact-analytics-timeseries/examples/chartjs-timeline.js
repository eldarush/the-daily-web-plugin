/**
 * Impact Analytics Timeline Chart (Chart.js / Canvas)
 * Renders views over time with vertical milestone annotations marking editor updates.
 */

class ImpactAnalyticsChart {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
  }

  renderChart(timelineData, updateMilestones) {
    if (!this.canvas) return;
    if (this.chart) this.chart.destroy();

    const labels = timelineData.map(d => d.timestamp);
    const views = timelineData.map(d => d.views);

    // Prepare custom annotation plugin or marker points for updates
    const milestoneIndices = updateMilestones.map(m => {
      const targetTime = new Date(m.publishedAt).getTime();
      let closestIdx = 0;
      let minDiff = Infinity;
      labels.forEach((l, idx) => {
        const diff = Math.abs(new Date(l).getTime() - targetTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      return { index: closestIdx, label: m.changelogNote || 'פורסם עדכון עורך' };
    });

    const ctx = this.canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(l => new Date(l).toLocaleString('he-IL', { month: 'numeric', day: 'numeric', hour: '2-digit' })),
        datasets: [
          {
            label: 'כמות צפיות',
            data: views,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'דינמיקת צפיות בכתבה והשפעת עדכוני תוכן (Impact Analytics)',
            font: { size: 16 }
          },
          tooltip: {
            callbacks: {
              afterBody: (tooltipItems) => {
                const itemIdx = tooltipItems[0].dataIndex;
                const match = milestoneIndices.find(m => m.index === itemIdx);
                return match ? `\n📌 ${match.label}` : '';
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'ציר זמן' }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'מספר צפיות' }
          }
        }
      }
    });
  }
}
