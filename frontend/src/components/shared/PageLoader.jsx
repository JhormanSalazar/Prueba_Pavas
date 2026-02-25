const PageLoader = ({ text = 'Cargando...' }) => (
  <div className="flex items-center justify-center py-20 text-gray-400 text-lg gap-2">
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
    {text}
  </div>
);

export default PageLoader;