import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div
      className="flex flex-col items-center justify-center h-[calc(100%-3rem)] bg-center bg-cover rounded-b-lg relative"
      style={{
        backgroundImage: 'url("/hero-image.jpg")',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <h1 className="text-5xl font-bold text-white z-10">
        Virtual Dream House
      </h1>
      <p className="text-lg text-white z-10">
        Virtual 3D Game Simulation to Design and Build Your Dream Home
      </p>
      <Button className="mt-4 bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 z-10">
        Download Now
      </Button>
    </div>
  );
}
