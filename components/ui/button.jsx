export function Button({ className, variant = "default", size = "default", ...props }) {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
    const variantStyles = {
      default: "bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]",
      destructive: "bg-[rgb(var(--destructive))] text-[rgb(var(--destructive-foreground))]",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-[rgb(var(--secondary))] text-[rgb(var(--secondary-foreground))]",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    }
  
    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10 p-0",
    }
  
    const classes = [baseStyles, variantStyles[variant], sizeStyles[size], className].join(" ")
  
    return <button className={classes} {...props} />
  }
  