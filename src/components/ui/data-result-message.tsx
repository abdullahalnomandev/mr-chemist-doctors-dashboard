"use client";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon, TextSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import React from "react";

const imageVariants = cva("relative", {
  variants: {
    size: {
      sm: "size-28",
      lg: "size-64",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

type PlaceholderIconProps = {
  /** The placeholder type. */
  placeholder?: "icon";
  /** The icon to render. */
  icon?: LucideIcon;
};

type PlaceholderImageProps = {
  /** The placeholder type. */
  placeholder?: "image";
  /** The image to render. */
  image?: string;
};

interface BaseProps extends VariantProps<typeof imageVariants> {
  /** The message text. */
  message?: string;
  /** The children to render. */
  children?: React.ReactNode;
}

type DataResultMessageProps = BaseProps &
  (PlaceholderIconProps | PlaceholderImageProps);

/**
 * Renders a message component with an optional icon and text message. This component is designed
 * to display a data result message, potentially as feedback to user actions or as an informational
 * message within the application.
 *
 * @param {DataResultMessageProps} props The component props.
 * @returns {React.JSX.Element} A JSX.Element that renders a div containing the optionally rendered icon
 * and message text, styled with a specific set of classes for layout and appearance.
 */

const DataResultMessage = ({
  message,
  children,
  ...props
}: DataResultMessageProps): React.JSX.Element => {
  const placeholder = props.placeholder ?? "image";
  const size = props?.size;

  let renderedElement: React.JSX.Element = <></>;

  if (placeholder === "image") {
    const imageProps = props as PlaceholderImageProps;
    const imageSrc = imageProps.image || "/images/folder-empty.svg";
    renderedElement = (
      <div className={cn("relative", imageVariants({ size }))}>
        <Image
          src={imageSrc}
          alt="Data result"
          fill
          className="object-contain"
        />
      </div>
    );
  }

  if (placeholder === "icon") {
    const iconProps = props as PlaceholderIconProps;
    const Icon = iconProps.icon || TextSearch;
    renderedElement = <Icon className={imageVariants({ size })} />;
  }

  return (
    <div className="m-auto flex size-full flex-col items-center justify-center gap-3 p-3 text-secondary-foreground">
      {renderedElement}
      {message && <p className="text-center font-medium">{message}</p>}
      {children}
    </div>
  );
};

export default DataResultMessage;

interface CommonMessageProps {
  size?: DataResultMessageProps["size"];
  message?: string;
}

// use this component to show with a fixed error message
export const ErrorResultMessage = ({
  size = "lg",
  message,
}: CommonMessageProps) => (
  <DataResultMessage
    message={message || "Something went wrong! Please try again later."}
    size={size}
    image="/images/error.jpg"
  />
);

// use this component to show with a fixed empty results message
export const EmptyResultMessage = ({
  size = "sm",
  message,
}: CommonMessageProps) => (
  <DataResultMessage
    message={message || "No data found"}
    size={size}
    image="/images/folder-empty.jpg"
  />
);

// use this component to show with a fixed not found message
export const NotFoundMessage = ({
  size = "sm",
  message,
  trackPath,
}: CommonMessageProps & { trackPath?: string }) => (
  <DataResultMessage
    message={
      message ||
      "Seems like you are lost! The page you are looking for might not exist."
    }
    size={size}
    image="/images/not-found.svg"
  >
    <Button variant="outline" asChild>
      <Link href={trackPath || "/"}>Return to track</Link>
    </Button>
  </DataResultMessage>
);

// use this component to show in a empty data message with an action
export const EmptyResultWithActionMessage = ({
  image,
  title,
  message,
  children,
}: {
  image?: string;
  title: string;
  message?: string;
  children: React.ReactNode;
}) => (
  <DataResultMessage image={image || "/images/confused.svg"}>
    <h1 className="text-xl font-bold">{title}</h1>
    <p>{message}</p>
    {children}
  </DataResultMessage>
);
