import { Avatar, AvatarImage, cn } from "@/core/libs";
import { useSchool } from "@/features/schools";
import React from "react";
import { Link } from "react-router-dom";

interface BrandProps {
  isCollapsed?: boolean;
}

export const Brand = React.memo(({ isCollapsed }: BrandProps) => {
  const school = useSchool();

  console.log('scholl', school)

  return (
    <div
      className={cn(
        "sidebar-brand w-full flex h-14 items-center z-[22] border-b border-white/20 px-4 lg:h-[60px] lg:px-6",
        isCollapsed && "justify-center",
      )}
    >
      <Link
        to="/"
        className={cn(
          "sidebar-brand-logo flex items-center gap-2 font-semibold",
          isCollapsed && "justify-center",
        )}
      >
        {
        school.data?.[0]?.file && 
          (
            <Avatar>
                <>
                  <AvatarImage
                    src={`https://dev.kiraproject.id${school?.data?.[0]?.file}`}
                    alt={school.data?.[0]?.namaSekolah || 'SUPER ADMIN'}
                    className="object-cover object-center bg-white"
                  />
                </>
            </Avatar>
          )
        }
        <div className="flex flex-col">
          <p className="relative top-[2px] text-sm whitespace-nowrap font-bold">
            XPRESENSI GURU
          </p>
          <p className="text-[10px] font-normal opacity-75">
            {school.data?.[0]?.namaSekolah || 'SUPER ADMIN'}
          </p>
        </div>
      </Link>
    </div>
  );
});

Brand.displayName = "Brand";