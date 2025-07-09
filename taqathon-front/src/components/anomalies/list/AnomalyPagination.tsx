import { Button } from "@/components/ui/button";

interface AnomalyPaginationProps {
  page: number;
  extraData: any;
  setPage: (page: number) => void;
  listT: any;
  t: any;
}

export const AnomalyPagination = ({
  page,
  extraData,
  setPage,
  listT,
  t,
}: AnomalyPaginationProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button
        variant="outline"
        onClick={() => {
          if (extraData?.hasPrev) {
            setPage(page - 1);
          }
        }}
        disabled={!extraData?.hasPrev}
        className="hover-lift modern-shadow"
      >
        {listT.previous}
      </Button>
      <div className="px-4 py-2 bg-muted/20 rounded-lg backdrop-blur-sm">
        <span className="text-sm font-medium">
          {t("anomalyList.pageOfPages", {
            current: page,
            total: Math.ceil(
              (extraData?.total || 0) / (extraData?.limit || 10),
            ),
            fallback: `Page ${page} of ${Math.ceil((extraData?.total || 0) / (extraData?.limit || 10))}`,
          })}
        </span>
      </div>
      <Button
        variant="outline"
        onClick={() => {
          if (extraData?.hasNext) {
            setPage(page + 1);
          }
        }}
        disabled={!extraData?.hasNext}
        className="hover-lift modern-shadow"
      >
        {listT.next}
      </Button>
    </div>
  );
}; 