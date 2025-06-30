/* eslint-disable @typescript-eslint/no-empty-object-type */
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Eye, EyeOff, Search, X } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const inputVariants = cva(
  "mt-1 peer flex w-full border transition bg-background px-4 file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
  {
    variants: {
      inputSize: {
        default: "py-2 h-input",
        sm: "py-1.5 text-sm h-9",
        lg: "py-3 text-lg h-14",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
);

interface InputComponentProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputComponentProps>(
  ({ className, type, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef<HTMLInputElement, InputComponentProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const disabled =
      props.value === "" || props.value === undefined || props.disabled;

    return (
      <div className='relative'>
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("hide-password-toggle h- pr-10", className)}
          ref={ref}
          {...props}
        />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='absolute right-0 top-0 h-full px-3 py-2 text-border hover:bg-transparent peer-focus:text-primary'
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}>
          {showPassword && !disabled ? (
            <Eye className='h-4 w-4' aria-hidden='true' />
          ) : (
            <EyeOff className='h-4 w-4' aria-hidden='true' />
          )}
          <span className='sr-only'>
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>

        <style>{`
        .hide-password-toggle::-ms-reveal,
        .hide-password-toggle::-ms-clear {
            visibility: hidden;
            pointer-events: none;
            display: none;
        }
      `}</style>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export interface SearchInputProps extends InputComponentProps {
  containerClassName?: HTMLDivElement["className"];
  hideSearchIcon?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { className, containerClassName, hideSearchIcon = false, ...props },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleClear = () => {
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
      if (props.onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(event);
      }
    };

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <Input
          type='text'
          className={cn("peer", hideSearchIcon ? "pr-10" : "px-10", className)}
          ref={(node) => {
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
            (
              inputRef as React.MutableRefObject<HTMLInputElement | null>
            ).current = node;
          }}
          {...props}
        />
        {!hideSearchIcon && (
          <Search className='w-4 h-4 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-foreground peer-focus:text-primary' />
        )}

        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='absolute right-0 top-0 block h-full px-3 py-2 text-border hover:bg-transparent peer-placeholder-shown:hidden'
          onClick={handleClear}>
          <X />
          <span className='sr-only'>Clear search</span>
        </Button>
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { Input, PasswordInput, SearchInput };
