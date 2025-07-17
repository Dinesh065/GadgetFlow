export function Card({ children, className }) {
  return <div className={`rounded-xl border bg-white shadow ${className}`}>{children}</div>;
}

export function CardHeader({ children, className }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={`text-xl font-semibold ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className }) {
  return <p className={`text-gray-500 text-sm ${className}`}>{children}</p>;
}
