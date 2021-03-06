import { Listener } from "./store/modules/listener";
import dataLabels from "chartjs-plugin-datalabels";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const defaultObject = (obj: any, key: string, value: number) => {
  if (obj[key] === undefined) obj[key] = value;
  else {
    obj[key] = obj[key] + value;
  }
};

interface ChartData {
  labels: Array<string>;
  data: Array<number>;
}

const generateChartData = (
  chartType: string,
  listeners: Listener[]
): ChartData => {
  if (chartType == "line") {
    let dataset: Record<string, number> = {};
    let upperBoundMonth: number = 0;

    listeners.forEach((listener) => {
      listener.logs.forEach((log) => {
        const date = new Date(log.timestamp);
        defaultObject(dataset, MONTHS[date.getMonth()], 1);
      });
    });

    let data: Array<number> = [];

    MONTHS.forEach((month) => {
      if (Object.keys(dataset).indexOf(month) < 0) data.push(0);
      else data.push(dataset[month]);
    });

    data.forEach((d, idx) => {
      if (d > 0) upperBoundMonth = idx + 1;
    });

    return {
      labels: MONTHS.slice(0, upperBoundMonth),
      data,
    };
  } else {
    let labels: Array<string> = [];
    let data: Array<number> = [];

    for (let i = 0; i < listeners.length; i++) {
      labels.push(listeners[i].title);
      data.push(listeners[i].logs.length);
    }
    return {
      labels,
      data,
    };
  }
};

export const generateChart = (chartType: string, listeners: Listener[]) => {
  const { labels, data } = generateChartData(chartType, listeners);
  if (chartType == "line") {
    return {
      type: chartType,
      plugins: [dataLabels],

      data: {
        labels,
        datasets: [
          {
            label: "Monthly Activity",
            data,
            fill: false,
            borderColor: "#41B883",
            tension: 0.5,
            backgroundColor: "#555",
          },
        ],
      },
      options: {
        fill: false,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
        },
        radius: 0,
        plugins: {
          datalabels: {
            backgroundColor: function (context: any) {
              return context.dataset.backgroundColor;
            },
            borderRadius: 4,
            color: "white",
            font: {
              weight: "bold",
            },
            formatter: Math.round,
            padding: 6,
          },
        },
      },
    };
  } else if (chartType == "doughnut") {
    return {
      type: chartType,
      options: { responsive: true, maintainAspectRatio: false },
      data: {
        labels,
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
            data,
          },
        ],
      },
    };
  }
};
