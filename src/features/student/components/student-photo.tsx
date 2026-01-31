import { AspectRatio, Avatar, AvatarFallback, AvatarImage } from "@/core/libs";

export interface StudentPhotoProps {
  image?: string;
  title?: string;
}

export const StudentPhoto = ({ image, title }: StudentPhotoProps) => {
  const nameArr = title?.split(" ") || [];
  const initialName =
    nameArr && nameArr.length > 0
      ? `${nameArr?.[0]?.[0]?.toUpperCase() || ""}${nameArr?.[1]?.[0]?.toUpperCase() || ""}`
      : "-";

  return (
    <AspectRatio ratio={1 / 1}>
      <Avatar className="w-full h-full rounded-none">
        <AvatarImage src={image} alt={title} className="bg-no-repeat" />
        <AvatarFallback className="rounded-none text-7xl">
          {initialName}
        </AvatarFallback>
      </Avatar>
    </AspectRatio>
  );
};
