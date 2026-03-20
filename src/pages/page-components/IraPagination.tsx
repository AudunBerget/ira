import {Pagination, usePagination} from "@digdir/designsystemet-react";

export type PaginationProps = {
  currentSetPage: number;
  setCurrentPage: (page: number) => void;
  showPages: number;
  totalPages: number;
}

const IraPagination = ({
  showPages,
  currentSetPage,
  setCurrentPage,
  totalPages,
}: PaginationProps) => {
  const {pages, nextButtonProps, prevButtonProps} = usePagination({
    currentPage: currentSetPage,
    setCurrentPage: setCurrentPage,
    totalPages: totalPages,
    showPages: showPages,
  });

    return (
        <Pagination aria-label='Navigering sangside'>
          <Pagination.List>
            <Pagination.Item>
              <Pagination.Button
                asChild
                aria-label='Forrige side'
                {...prevButtonProps}
              >
                <a href="#previous">Forrige</a>
              </Pagination.Button>
            </Pagination.Item>
            {
              pages.map(({page, itemKey, buttonProps}) => (
                <Pagination.Item key={itemKey}>
                  {typeof page === 'number' && (
                  <Pagination.Button
                    asChild
                    aria-label={`${page}`}
                    {...buttonProps}
                  >
                    <a href={`#${page}`}>{page}</a>
                  </Pagination.Button>
                    )}
                </Pagination.Item>
              ))
            }
            <Pagination.Item>
              <Pagination.Button
                asChild
                aria-label='Neste side'
                {...nextButtonProps}
              >
                <a href='#next'>Neste</a>
              </Pagination.Button>
            </Pagination.Item>
          </Pagination.List>
        </Pagination>
    )
}

export default IraPagination;
