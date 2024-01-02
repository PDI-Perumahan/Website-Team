"use client";

import getSceneById from "@/actions/get-scene-by-id";
import SceneViewer, { SceneRendererProps } from "@/components/scene-viewer";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export default function GalleryViewer({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [jsonData, setJsonData] = useState<SceneRendererProps>();

  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);

    getSceneById(params.id)
      .then((res) => {
        setJsonData(res.scene as unknown as SceneRendererProps);
      })
      .catch(() => {
        toast({ title: "Failed to fetch scene", variant: "destructive" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="h-screen w-screen">
      {isLoading || !jsonData ? (
        <div className="col-span-full text-center">
          <h2 className="text-2xl font-bold tracking-tighter">Loading...</h2>
        </div>
      ) : (
        <SceneViewer {...jsonData} />
      )}
    </div>
  );
}
