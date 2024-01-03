"use client";

import AssetCard from "@/components/asset-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
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
import AssetViewer from "@/components/asset-viewer";
import { getAllAssets } from "@/actions/get-all-assets";
import { deleteAsset } from "@/actions/delete-asset";
import { Assets } from "@prisma/client";
import captureThumbnail from "@/utils/capture-thumbnail";

const formUploadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  file: z.any().refine((file: File) => file !== null, "File is required"),
  xSize: z.number({
    required_error: "X Size is required",
  }),
  ySize: z.number({
    required_error: "Y Size is required",
  }),
  zSize: z.number({
    required_error: "Z Size is required",
  }),
});

const formEditSchema = z.object({
  name: z.string(),
  file: z.any(),
  xSize: z.number({
    required_error: "X Size is required",
  }),
  ySize: z.number({
    required_error: "Y Size is required",
  }),
  zSize: z.number({
    required_error: "Z Size is required",
  }),
});

export default function Home() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Dialog States
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [assetsList, setAssetsList] = useState<Assets[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Assets | null>(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);

  useEffect(() => {
    setIsLoadingAssets(true);

    getAllAssets()
      .then((res) => {
        setAssetsList(res);
      })
      .catch(() => {
        toast({ title: "Failed to fetch assets", variant: "destructive" });
      })
      .finally(() => {
        setIsLoadingAssets(false);
      });
  }, []);

  const uploadForm = useForm<z.infer<typeof formUploadSchema>>({
    resolver: zodResolver(formUploadSchema),
  });

  const editForm = useForm<z.infer<typeof formEditSchema>>({
    resolver: zodResolver(formEditSchema),
  });

  async function onUploadSubmit(values: z.infer<typeof formUploadSchema>) {
    const formData = new FormData();

    const data = {
      name: values.name,
      modelFile: values.file[0],
      x: String(values.xSize),
      y: String(values.ySize),
      z: String(values.zSize),
    };

    Object.entries(data).forEach(([key, value]) => {
      formData.set(key, value);
    });

    // Capture thumbnail
    const thumbnail = await captureThumbnail(values.file[0]);
    formData.set("thumbnail", thumbnail);

    setIsUploading(true);

    try {
      const result = await axios.post("/api/assets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (result.status === 200) {
        toast({
          title: "Upload Success",
        });

        await updateList();
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsUploadDialogOpen(false);
      uploadForm.reset();
      setIsUploading(false);
    }
  }

  async function onEditSubmit(values: z.infer<typeof formEditSchema>) {
    if (selectedAsset === null) return;

    const formData = new FormData();

    const data = {
      id: String(selectedAsset.id),
      name: values.name,
      x: String(values.xSize),
      y: String(values.ySize),
      z: String(values.zSize),
    };

    Object.entries(data).forEach(([key, value]) => {
      formData.set(key, value);
    });

    if (values.file) {
      // Capture thumbnail
      const thumbnail = await captureThumbnail(values.file[0]);
      formData.set("thumbnail", thumbnail);

      formData.set("modelFile", values.file[0]);
    }

    setIsUploading(true);

    try {
      console.log("ini try")
      const result = await axios.put("/api/assets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          id: selectedAsset.id,
        },
      });

      console.log("ini erro:",result);

      if (result.status === 200) {
        toast({
          title: "Edit Success",
        });

        await updateList();
      }
    } catch (error) {
      console.log(error)
      // console.error("Edit Failed:", error);
      // let errorMessage = "Edit Failed";
      // if (axios.isAxiosError(error)) {
      //   if(error.response){
      //     errorMessage = `Server responded with error: ${error.response.data}`;
      //     console.error("Server error details:", error.response.data);
      //   } else if(error.request){
      //     errorMessage = "No response received from the server";
      //     console.error("No response from the server");
      //   }
      // }
      toast({
        title: "Edit Failed",
        variant: "destructive",
      });
    } finally {
      setIsEditDialogOpen(false);
      uploadForm.reset();
      setIsUploading(false);
    }
  }

  async function handleDeleteAsset() {
    if (!selectedAsset) return;

    try {
      await deleteAsset(selectedAsset.id);
      toast({ title: "Delete Success" });
    } catch (error) {
      toast({ title: "Delete Failed", variant: "destructive" });
      return;
    }

    setIsDeleteDialogOpen(false);

    await updateList();

    setSelectedAsset(null);
  }

  async function updateList() {
    setIsLoadingAssets(true);

    try {
      const res = await getAllAssets();
      setAssetsList(res);
    } catch (error) {
      toast({ title: "Failed to update asset list", variant: "destructive" });
    } finally {
      setIsLoadingAssets(false);
    }
  }

  return (
    <>
      <main className="flex min-h-screen flex-col px-24 py-16">
        <div className="flex justify-between">
          <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Assets
            </h2>
          </div>
          <Button onClick={() => setIsUploadDialogOpen(true)}>Upload</Button>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-16">
          {isLoadingAssets ? (
            <div className="col-span-full text-center">
              <h2 className="text-2xl font-bold tracking-tighter">
                Loading...
              </h2>
            </div>
          ) : assetsList.length === 0 ? (
            <div className="col-span-full text-center">
              <h2 className="text-2xl font-bold tracking-tighter">No Assets</h2>
              <p className="text-gray-500 mt-4">
                You don&apos;t have any assets yet. You can upload new assets by
                clicking the upload button above.
              </p>
            </div>
          ) : (
            assetsList.map((asset, index) => (
              <AssetCard
                key={index}
                title={asset.name}
                createdAt={new Date(asset.createdAt)}
                imageSrc={asset.thumbnailUrl}
                onClickView={() => {
                  setSelectedAsset(asset);
                  setIsViewDialogOpen(true);
                }}
                onClickEdit={() => {
                  setSelectedAsset(asset);
                  editForm.setValue("name", asset.name);
                  editForm.setValue("xSize", asset.xSize);
                  editForm.setValue("ySize", asset.ySize);
                  editForm.setValue("zSize", asset.zSize);
                  setIsEditDialogOpen(true);
                }}
                onClickDelete={() => {
                  setSelectedAsset(asset);
                  setIsDeleteDialogOpen(true);
                }}
              />
            ))
          )}
        </div>
      </main>
      <Dialog
        onOpenChange={(open) => {
          setIsViewDialogOpen(open);

          if (!open) {
            setSelectedAsset(null);
          }
        }}
        open={isViewDialogOpen}
      >
        <DialogContent className="w-screen h-1/2">
          <DialogHeader>
            <DialogTitle>View Model</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full">
            {selectedAsset && isViewDialogOpen && (
              <AssetViewer model={selectedAsset.modelUrl} />
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        onOpenChange={(open) => {
          editForm.reset();

          setIsEditDialogOpen(open);
        }}
        open={isEditDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedAsset?.name}</DialogTitle>
            <DialogDescription>
              You can edit your assets here.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="flex-grow" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">File</FormLabel>
                        <FormControl>
                          <Input
                            {...editForm.register("file")}
                            type="file"
                            className="flex-grow"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="xSize"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">X Size</FormLabel>
                        <FormControl>
                          <Input
                            {...editForm.register("xSize", {
                              valueAsNumber: true,
                            })}
                            className="flex-grow"
                            type="number"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="ySize"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">Y Size</FormLabel>
                        <FormControl>
                          <Input
                            {...editForm.register("ySize", {
                              valueAsNumber: true,
                            })}
                            className="flex-grow"
                            type="number"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="zSize"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">Z Size</FormLabel>
                        <FormControl>
                          <Input
                            {...editForm.register("zSize", {
                              valueAsNumber: true,
                            })}
                            className="flex-grow"
                            type="number"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
                setSelectedAsset(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteAsset()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        onOpenChange={(open) => {
          uploadForm.reset();
          setIsUploadDialogOpen(open);
        }}
        open={isUploadDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Assets</DialogTitle>
            <DialogDescription>
              You can upload new assets here.
            </DialogDescription>
          </DialogHeader>
          <Form {...uploadForm}>
            <form onSubmit={uploadForm.handleSubmit(onUploadSubmit)}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={uploadForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="flex-grow" />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={uploadForm.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">File</FormLabel>
                        <FormControl>
                          <Input
                            {...uploadForm.register("file")}
                            type="file"
                            className="flex-grow"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={uploadForm.control}
                  name="xSize"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">X Size</FormLabel>
                        <FormControl>
                          <Input
                            {...uploadForm.register("xSize", {
                              valueAsNumber: true,
                            })}
                            className="flex-grow"
                            type="number"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={uploadForm.control}
                  name="ySize"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">Y Size</FormLabel>
                        <FormControl>
                          <Input
                            {...uploadForm.register("ySize", {
                              valueAsNumber: true,
                            })}
                            className="flex-grow"
                            type="number"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={uploadForm.control}
                  name="zSize"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="flex flex-col gap-4">
                        <FormLabel className="text-left">Z Size</FormLabel>
                        <FormControl>
                          <Input
                            {...uploadForm.register("zSize", {
                              valueAsNumber: true,
                            })}
                            className="flex-grow"
                            type="number"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
