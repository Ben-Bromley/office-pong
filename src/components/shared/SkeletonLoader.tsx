const SkeletonLoader = ({ rows } : { rows: number }) => {
  const loaders = [];
  for (let i = 0; i < rows; i++) {
    loaders.push(<span key={i} className="block bg-gray-100 rounded-md px-4 py-4 mb-2 animate-pulse" />)
  }
  return (<div>{loaders}</div>)
}

export default SkeletonLoader