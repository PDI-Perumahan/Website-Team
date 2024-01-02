"use client";

import AssetCard from "@/components/asset-card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAllAssets } from "@/actions/get-all-assets";
import { deleteAsset } from "@/actions/delete-asset";
import { Assets, Scene } from "@prisma/client";
import SceneCard from "@/components/scene-card";
import { getAllScenes } from "@/actions/get-all-scenes";
import { useRouter } from "next/navigation";

export default function Home() {
  const { toast } = useToast();

  // Dialog States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [sceneList, setSceneList] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setIsLoadingGallery(true);

    getAllScenes()
      .then((res) => {
        setSceneList(res);
      })
      .catch(() => {
        toast({ title: "Failed to fetch gallery", variant: "destructive" });
      })
      .finally(() => {
        setIsLoadingGallery(false);
      });
  }, []);

  async function handleDeleteScene() {
    if (!selectedScene) return;

    try {
      await deleteAsset(selectedScene.id);
      toast({ title: "Delete Success" });
    } catch (error) {
      toast({ title: "Delete Failed", variant: "destructive" });
      return;
    }

    setIsDeleteDialogOpen(false);

    await updateList();

    setSelectedScene(null);
  }

  async function updateList() {
    setIsLoadingGallery(true);

    try {
      const res = await getAllScenes();
      setSceneList(res);
    } catch (error) {
      toast({ title: "Failed to update asset list", variant: "destructive" });
    } finally {
      setIsLoadingGallery(false);
    }
  }

  return (
    <>
      <main className="flex min-h-screen flex-col px-24 py-16">
        <div className="flex justify-between">
          <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Gallery
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-16">
          {isLoadingGallery ? (
            <div className="col-span-full text-center">
              <h2 className="text-2xl font-bold tracking-tighter">
                Loading...
              </h2>
            </div>
          ) : sceneList.length === 0 ? (
            <div className="col-span-full text-center">
              <h2 className="text-2xl font-bold tracking-tighter">No Scenes</h2>
              <p className="text-gray-500 mt-4">
                You don&apos;t have any scene yet.
              </p>
            </div>
          ) : (
            sceneList.map((scene, index) => (
              <SceneCard
                key={index}
                name={scene.name}
                createdAt={new Date(scene.createdAt)}
                onClickView={() => {
                  setSelectedScene(scene);
                  router.push(`/gallery/${scene.id}`);
                }}
                onClickDelete={() => {
                  setSelectedScene(scene);
                  setIsDeleteDialogOpen(true);
                }}
              />
            ))
          )}
        </div>
      </main>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => setIsDeleteDialogOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              assets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedScene(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteScene()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
