import React, {useEffect, useRef, useState} from "react";
import Button from "../components/common/Button";
import {Delaunay} from "d3-delaunay";

type Point = {
  x: number;
  y: number;
}

type Cluster = { points: Point[]; center: Point; };

type Brush = "data" | "center";

export default function KMeans() {
  const [points, setPoints] = useState<Point[]>([]);
  const [centers, setCenters] = useState<Point[]>([]);
  const [startCenters, setStartCenters] = useState<Point[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);

  const [mode, setMode] = useState<Brush>("data");
  const [radius, setRadius] = useState<number>(10);
  const [count, setCount] = useState<number>(10);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [showVoronoi, setShowVoronoi] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const finished = step > 0 && !hasChanged;

  const handleCanvasClick = (e: { clientX: number; clientY: number; }) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === "center") {
      setCenters((prevCenters) => [...prevCenters, {x, y}]);
    } else {
      const newPoints: Point[] = [];
      for (let i = 0; i < count; i++) {
        const r = radius * Math.sqrt(Math.random())
        const theta = Math.random() * 2 * Math.PI

        newPoints.push({
          x: x + r * Math.cos(theta),
          y: y + r * Math.sin(theta),
        });
      }
      setPoints((prevPoints) => [...prevPoints, ...newPoints]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (canvas?.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw points
    points.forEach((point: Point) => {
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw centers
    centers.forEach((center: Point) => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(center.x, center.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    if (showVoronoi) {
      drawVoronoi(ctx, centers, canvas.width, canvas.height);
    }
  }, [points, centers, showVoronoi]);

  const handleStepForward = () => {
    if (step === 0) {
      // Assign points to clusters in the first step
      const initialClusters = assignPointsToClusters(points, centers);
      setStartCenters(centers);
      setClusters(initialClusters);
      setHasChanged(true);
    } else {
      // Recalculate centers and reassign points
      const newCenters = recalculateCenters(clusters);
      const updatedClusters = assignPointsToClusters(points, newCenters);
      setHasChanged(JSON.stringify(clusters) !== JSON.stringify(updatedClusters));
      setClusters(updatedClusters);
      setCenters(newCenters);
    }
    setStep(step + 1);
  };

  const handleReset = () => {
    setClusters([]);
    setCenters(startCenters);
    setStep(0);
  };

  return (
    <div className="container">
      <h1>K-Means</h1>
      <div className="mx-auto max-w-[600px]">
        <div className="flex flex-row justify-between items-center pb-1">
          <div className="flex flex-row items-center gap-2">
            <button onClick={() => setMode("center")}
                    className="rounded w-8 h-8"
                    title={"Center point brush"}
                    style={{borderWidth: mode === "center" ? "2px" : "1px"}}>
              <div className="rounded-full w-4 h-4 bg-red-500"></div>
            </button>
            <button onClick={() => setMode("data")}
                    className="rounded w-8 h-8 flex justify-center items-center"
                    title={"Data point brush"}
                    style={{borderWidth: mode === "data" ? "2px" : "1px"}}>
              <div className="rounded-full w-2 h-2 bg-blue-950"></div>
            </button>
            <div className="flex flex-col">
              <div className="flex flex-col">
                <label htmlFor="radius-slider">Size: {radius}</label>
                <input type="range" min="1" max="100" value={radius} id="radius-slider"
                       onChange={e => setRadius(Number(e.target.value))}/>
              </div>
              <div className="flex flex-col">
                <label htmlFor="count-slider">Count: {count}</label>
                <input type="range" min="1" max="100" value={count} id="count-slider"
                       onChange={e => setCount(Number(e.target.value))}/>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-2"><Button variant="danger" onClick={() => {
            handleReset();
            setCenters([]);
            setStartCenters([]);
          }}>Remove center points</Button>
            <Button variant="danger" onClick={() => {
              setPoints([]);
              handleReset();
            }}>Remove data points</Button>
          </div>
        </div>
        <div className={`my-4 mx-auto
          w-[300px] h-[600px]
          sm:w-[500px] sm:h-[550px]
          md:w-[600px] md:h-[500px]
        `}>
          <canvas
            ref={canvasRef}
            width={"100%"}
            height={"auto"}
            className={"border-2 border-solid border-black rounded-xl shadow-[8px_8px_0px_0px_black]"}
            onClick={handleCanvasClick}
          />
        </div>
        <div className="flex flex-row gap-2 justify-between">
          <div className="flex gap-2 items-center">
            <span>Step: {step}, Finished: {finished ? "yes" : "no"}</span>
            <Button onClick={handleStepForward}
                    disabled={centers.length === 0 || points.length === 0 || finished}>
              Step Forward
            </Button>
            <Button variant={"warn"} onClick={handleReset}>Reset</Button>
          </div>

          <Button onClick={() => setShowVoronoi(!showVoronoi)}>
            {showVoronoi ? "Hide Voronoi" : "Show Voronoi"}
          </Button>
        </div>
      </div>
    </div>
  );
}


const assignPointsToClusters = (points: Point[], centers: Point[]): Cluster[] => {
  const clusters: Cluster[] = centers.map(center => ({points: [], center}));

  points.forEach(point => {
    let closestCenterIndex = 0;
    let minDistance = Infinity;

    centers.forEach((center, index) => {
      const distance = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
      if (distance < minDistance) {
        minDistance = distance;
        closestCenterIndex = index;
      }
    });

    clusters[closestCenterIndex].points.push(point);
  });

  return clusters;
};

const recalculateCenters = (clusters: Cluster[]): Point[] => {
  return clusters.map(cluster => {
    if (cluster.points.length === 0) return cluster.center; // No change if no points
    const avgX = cluster.points.reduce((sum, p) => sum + p.x, 0) / cluster.points.length;
    const avgY = cluster.points.reduce((sum, p) => sum + p.y, 0) / cluster.points.length;
    return {x: avgX, y: avgY};
  });
};

const drawVoronoi = (ctx: CanvasRenderingContext2D, centers: Point[], width: number, height: number) => {
  if (centers.length < 2) return; // Voronoi requires at least two points

  const delaunay = Delaunay.from(centers.map(center => [center.x, center.y]));
  const voronoi = delaunay.voronoi([0, 0, width, height]);

  const colors = centers.map(
    (_, i) => `hsl(${(i * 360) / centers.length}, 60%, 70%, 0.2)`
  ); // Generate unique colors for each center

  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  ctx.lineWidth = 1;

  // Iterate over Voronoi cell edges
  for (let i = 0; i < delaunay.points.length; i += 2) {
    const polygon = voronoi.cellPolygon(i >> 1);
    if (polygon) {
      ctx.fillStyle = colors[i >> 1];

      ctx.beginPath();
      ctx.moveTo(polygon[0][0], polygon[0][1]);
      for (let j = 1; j < polygon.length; j++) {
        ctx.lineTo(polygon[j][0], polygon[j][1]);
      }
      ctx.closePath();
      ctx.fill();

      ctx.stroke();
    }
  }
};

