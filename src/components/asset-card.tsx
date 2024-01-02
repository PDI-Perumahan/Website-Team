"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import { Calendar, MoreVertical, Pencil, Trash } from "lucide-react";
import Image, { StaticImageData } from "next/image";

interface AssetCardProps {
  title: string;
  createdAt: Date;
  imageSrc: StaticImageData | string;
  onClickView: () => void;
  onClickEdit: () => void;
  onClickDelete: () => void;
}

export default function AssetCard({
  title,
  createdAt,
  imageSrc,
  onClickView,
  onClickEdit,
  onClickDelete,
}: AssetCardProps) {
  return (
    <Card>
      <CardHeader>
        <Image
          className="rounded-md"
          alt="Gallery Item"
          width={300}
          height={300}
          layout="responsive"
          src={imageSrc}
          objectFit="contain"
        />
      </CardHeader>
      <CardContent className="bg-white p-4 dark:bg-gray-950">
        <h3 className="font-semibold text-lg md:text-xl">{title}</h3>
        <div className="flex items-center gap-2 mt-2">
          <Calendar className="w-5 h-5 opacity-70" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Created on {createdAt.toLocaleDateString("en-US")}
          </span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button size="sm" onClick={onClickView}>
            View
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="py-1 px-2" variant="outline">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onClickEdit}>
                <Pencil className="w-5 h-5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClickDelete}>
                <Trash className="w-5 h-5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
