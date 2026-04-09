import {Pagination, usePagination} from "@digdir/designsystemet-react";
import styled from "@emotion/styled";

export type PaginationProps = {
  currentSetPage: number;
  setCurrentPage: (page: number) => void;
  showPages: number;
  totalPages: number;
}

export const StyledPagination = styled(Pagination)({
  color: "var(--ira-red-color)",

  /* All buttons */
  "& a": {
    color: "var(--ira-red-color)",
    textDecoration: "none",
  },

  /* Hover */
  "& a:hover": {
    backgroundColor: "var(--ira-red-color-100)",
  },

  /* Active/current page */
  '& [aria-current="page"]': {
    backgroundColor: "var(--ira-red-color-900)",
    color: "white",
  },

  '& :is(.ds-pagination :is(ol, ul)) > li > [aria-current="true"]': {
    backgroundColor: "var(--ira-red-color)",
    color: "var(--ds-color-base-contrast-default)",
    ':hover': {
      color: "var(--ira-red-color-1100)",
    }
  },

  /* Hide first/last ellipsis (aria-hidden elements) */
  "& li:first-of-type [aria-hidden='true']": {
    visibility: "hidden",
  },
  "& li:last-of-type [aria-hidden='true']": {
    visibility: "hidden",
  },
});

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
        <StyledPagination aria-label='Navigering sangside'>
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
        </StyledPagination>
    )
}

export default IraPagination;
