export const useVirtualization = (items: any[], options: {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) => {
  const overscan = options.overscan || 3;
  const totalHeight = items.length * options.itemHeight;
  const visibleItems = Math.ceil(options.containerHeight / options.itemHeight);
  const totalVisibleItems = visibleItems + 2 * overscan;

  return {
    totalHeight,
    visibleItems,
    totalVisibleItems,
    getItemsInView: (scrollTop: number) => {
      const startIndex = Math.max(0, Math.floor(scrollTop / options.itemHeight) - overscan);
      const endIndex = Math.min(items.length, startIndex + totalVisibleItems);
      return items.slice(startIndex, endIndex);
    }
  };
};

export default useVirtualization; 