import { VokadashHead } from "@/core/libs";
import { PropsWithChildren } from "react";

const bg =
  "https://images.unsplash.com/photo-1490642914619-7955a3fd483c?q=80&w=2093&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export interface AuthLayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  siteTitle?: string;
}

export const AuthLayout = ({
  description,
  title,
  children,
  image,
  logo,
  siteTitle,
}: AuthLayoutProps) => {

  const boxes = Array.from({ length: 1100 }, (_, i) => {
  const delay = (Math.random() * 9).toFixed(3); // delay antara 0 - 5 detik
  return (
      <div
      key={i}
      className='grid-box'
      style={{ animationDelay: `${delay}s` }}
      />
    )
  });
  return (
    <>
      {/* {siteTitle && (
        <VokadashHead>
          <title>{siteTitle}</title>
        </VokadashHead>
      )} */}
      <div className="relative w-full min-h-[100svh]">
        <div className="relative z-10 flex min-h-[100svh] items-center text-left">
          <div className="w-[100%] items-center justify-center flex flex-col">
            {/* {(title || description) && (
              <div className="w-[80%] mx-auto gap-2 text-left mb-4">
                {title && <h1 className="text-3xl font-bold">{title}</h1>}
                {description && (
                  <p className="text-balance text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )} */}

            {children}
          </div>
        </div>
        {/* Efek grid acak */}
        <div className="grid-container">
          {boxes}
        </div>
        <div className="hidden max-h-[100vh] bg-muted">
          {/* <img
            src={image || bg}
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          /> */}
        </div>
      </div>
    </>
  );
};
