import clsx from "clsx"

export const MainButton = ({ 
  as: Component = "button", 
  href, 
  className, 
  children, 
  ...props 
}) => {
  return (
    <Component
      {...props}
      href={href}
      className={clsx(
        "relative flex items-center justify-center px-8 py-2 text-lg font-semibold border overflow-hidden", 
        "text-white border-softGrey bg-golden group transition-all duration-300 shadow-lg hover:shadow-xl",
        className
      )}
    >
      {/* Content */}
      <span className="relative z-10 flex items-center transition-colors duration-300 group-hover:text-golden">
        {children}
      </span>

      {/* Overlay animation */}
      <span 
        className="absolute inset-0 left-0 w-0 transition-all duration-500 ease-out bg-darki group-hover:w-full" 
      />
    </Component>
  )
}

export default MainButton