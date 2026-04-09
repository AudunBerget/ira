import {Pagination, usePagination} from "@digdir/designsystemet-react";
import {type PaginationProps, StyledPagination} from "./IraPagination.tsx";


const IraPaginationMobile = ({
                         showPages,
                         currentSetPage,
                         setCurrentPage,
                         totalPages,
                       }: PaginationProps) => {
  const { prevButtonProps, nextButtonProps } = usePagination({
    currentPage: currentSetPage,
    setCurrentPage: setCurrentPage,
    totalPages: totalPages,
    showPages: showPages,
  });

  return (
    <StyledPagination aria-label='Navigering sangside'>
      <div style={{
        textAlign: 'center',
        color: 'var(--ira-red-color)',
      }}>
        {`${currentSetPage} / ${totalPages}`}
      </div>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Button
            asChild
            aria-label='Forrige side'
            {...prevButtonProps}
          >
            <a href='#prev'>Forrige</a>
          </Pagination.Button>
        </Pagination.Item>
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
    </StyledPagination>
  )
}

export default IraPaginationMobile;
