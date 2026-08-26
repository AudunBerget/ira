import SongCard from "./page-components/SongCard.tsx";
import {useMemo, useState} from "react";
import SearchBar from "./page-components/SearchBar.tsx";
import DatePicker from "./page-components/DatePicker.tsx";
import {getMinMaxDate, startOfDayMs} from "../utils/DateUtils.ts";
import {useDebounce} from "../hooks/useDebounce.ts";
import {SortOrder} from "../types/Sort.ts";
import SortCaret from "./page-components/SortCaret.tsx";
import IraPagination from "./page-components/IraPagination.tsx";
import {usePagination} from "@digdir/designsystemet-react";
import {ArrowCirclepathReverseIcon} from "@navikt/aksel-icons";
import {
  ComponentSongCardDetailsWrapper,
  ComponentSongCardHeader,
  ComponentSongCardWrapper,
  ComponentSongPaginationWrapper,
  SongControlLayout,
  SongLayout
} from "./page-layout-components/Songs.tsx";
import useIsMobileScreen from "../hooks/useIsMobileScreen.ts";
import IraPaginationMobile from "./page-components/IraPaginationMobile.tsx";
import type {Track, TrackKey} from "../utils/XslxParser.ts";
import MultiSelect from "./page-components/MultiSelect.tsx";

type SongProps = {
  data: Track[];
  songsPerPage?: number;
  showPages?: number;
}

type SongSort = {
  attribute: TrackKey;
  order: SortOrder;
}

const Songs = ({ data, songsPerPage = 50, showPages = 7 }: SongProps) => {
  const initialState = {
    artistQuery: '',
    titleQuery: '',
    selectedMembers: [],
    currentPage: 1,
    songSort: {attribute: 'date', order: SortOrder.ASC} as SongSort,
    dateFrom: getMinMaxDate(data).min,
    dateTo: getMinMaxDate(data).max,
  }
  const [itemsPerPage] = useState<number>(songsPerPage);
  // const [itemsPerPage, setItemsPerPage] = useState<number>(songsPerPage);
  const [artistQuery, setArtistQuery] = useState(initialState.artistQuery);
  const [titleQuery, setTitleQuery] = useState(initialState.titleQuery);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(initialState.selectedMembers);
  const [currentPage, setCurrentPage] = useState(initialState.currentPage);
  const [songSort, setSongSort] = useState<SongSort>(initialState.songSort);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const isMobile = useIsMobileScreen()

  type HeaderData = {
    displayName: string;
    keyName: TrackKey;
  }


  const headers: HeaderData[] = [
    {
      displayName: 'Dato',
      keyName: 'date',
    },
    {
      displayName: 'Artist',
      keyName: 'artist',
    },
    {
      displayName: 'Tittel',
      keyName: 'title',
    },
    {
      displayName: 'Spilt av',
      keyName: 'owner',
    },
  ]
  // const itemsPerPageOptions = [10, 25, 50, 100];


  const memberOptions = [
    ...Array.from(new Set(data.map(d => d['owner'])))
      .filter(Boolean)
      .sort((a, b) => {
        const aIsGuest = a.endsWith('(gjest)')
        const bIsGuest = b.endsWith('(gjest)')

        if (aIsGuest && !bIsGuest) return 1;
        if (!aIsGuest && bIsGuest) return -1;

        return a.localeCompare(b, "nb-NO")
      })
  ];

  const minMaxDates = getMinMaxDate(data);
  const [dateFrom, setDateFrom] = useState(initialState.dateFrom);
  const [dateTo, setDateTo] = useState(initialState.dateTo);

  const debouncedArtistQuery = useDebounce((artistQuery ?? "").trim().toLowerCase(), 300);
  const debouncedTitleQuery = useDebounce((titleQuery ?? "").trim().toLowerCase(), 300);

  const filteredSongs = useMemo(() => {
    const members = Array.isArray(selectedMembers) ? selectedMembers : [];
    const applyMemberFilter = members.length > 0 && !members.includes("alle");

    const fromMs = startOfDayMs(dateFrom);
    const toMs = startOfDayMs(dateTo);

    const filtered = data.filter((song) => {
      if (applyMemberFilter) {
        const spiltAv = (song['owner'] ?? "").toString().trim();
        if (!members.includes(spiltAv)) return false;
      }

      if (fromMs !== undefined || toMs !== undefined) {
        const d = new Date(song.date).getTime();
        if (Number.isNaN(d)) return false; // or treat as keep/skip per your policy
        if (fromMs !== undefined && d < fromMs) return false;
        if (toMs !== undefined && d > toMs) return false;
      }

      if (debouncedArtistQuery.length > 0 && debouncedTitleQuery.length > 0) {
        const artist = (song.artist ?? "").toString().toLowerCase();
        const title = (song.title ?? "").toString().toLowerCase();
        return artist.includes(debouncedTitleQuery) && title.includes(debouncedTitleQuery);

      } else if (debouncedArtistQuery.length > 0) {
        const artist = (song.artist ?? "").toString().toLowerCase();
        return artist.includes(debouncedArtistQuery);

      } else if (debouncedTitleQuery.length > 0) {
        const title = (song.title ?? "").toString().toLowerCase();
        return title.includes(debouncedTitleQuery);
      }

      setCurrentPage(1); // reset to first page on filter change
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const valueA = a[songSort.attribute] ?? "";
      const valueB = b[songSort.attribute] ?? "";

      let comparison = 0;
      if (valueA instanceof Date && valueB instanceof Date) {
        comparison = valueA.getTime() - valueB.getTime();
      } else {
        comparison = String(valueA).localeCompare(String(valueB));
      }

      return songSort.order === SortOrder.ASC ? comparison : -comparison;
    })

    return sorted;
  }, [data, debouncedArtistQuery, debouncedTitleQuery, selectedMembers,
    dateFrom, dateTo, songSort, setCurrentPage]);

  const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);
  usePagination({
    currentPage,
    setCurrentPage,
    totalPages: totalPages,
    showPages: showPages,
  });

  const pageOffset = (currentPage - 1) * itemsPerPage;

  // todo remember filters/søk when navigating away and back?
  // todo set number of hits per page
  // todo make search/filter header static such that only songs get scrolled?
  // todo style multiselect and datepicker (border, outline, focus..)

  function toggleSort(attribute: keyof Track) {
    if (songSort.attribute === attribute) {
      setSongSort({attribute, order: songSort.order === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC});
    } else {
      setSongSort({attribute, order: SortOrder.ASC});
    }
  }

  // todo feedback om sorting skal resettes også
  const isAnyFilterActive =
    artistQuery !== initialState.artistQuery ||
    titleQuery !== initialState.titleQuery ||
    // currentPage !== initialState.currentPage ||
    // songSort.attribute !== initialState.songSort.attribute ||
    // songSort.order !== initialState.songSort.order ||
    dateFrom !== initialState.dateFrom ||
    dateTo !== initialState.dateTo ||
    selectedMembers.join(',') !== initialState.selectedMembers.join(',');

  function resetFilters() {
    setArtistQuery(initialState.artistQuery);
    setTitleQuery(initialState.titleQuery);
    setSelectedMembers(initialState.selectedMembers);
    setCurrentPage(initialState.currentPage);
    // setSongSort(initialState.songSort);
    setDateFrom(initialState.dateFrom);
    setDateTo(initialState.dateTo);
  }

  return (
    <SongLayout>
      <SongControlLayout
        isOpen={isAccordionOpen}
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
        label='filter'
      >
        <div className='song-search'>
          <SearchBar
            label='Artist'
            placeholder='Søk etter artist...'
            value={artistQuery}
            onChange={(e) => setArtistQuery(e)}
            wrapperClassName='song-searchbar-wrapper'
            className='song-searchbar-input'
            clear={() => setArtistQuery('')}
          />
          <SearchBar
            label='Tittel'
            placeholder='Søk etter tittel...'
            value={titleQuery}
            onChange={(e) => setTitleQuery(e)}
            wrapperClassName='song-searchbar-wrapper'
            className='song-searchbar-input'
            clear={() => setTitleQuery('')}
          />
        </div>
        <div className='dropdown-form'>
          <label>Spilt av</label>
          {/*<MultiSelector*/}
          {/*  options={memberOptions}*/}
          {/*  value={selectedMembers}*/}
          {/*  onChange={(values) => setSelectedMembers(values)}*/}
          {/*/>*/}
          <MultiSelect
            members={memberOptions}
            selected={selectedMembers}
            onChange={(values) => setSelectedMembers(values)}
          />
        </div>
        <div className='song-date-picker'>
          <div className='song-date-picker-from'>
            <label>Fra dato</label>
            <DatePicker
              min={minMaxDates.min}
              max={minMaxDates.max}
              value={dateFrom}
              resetValue={minMaxDates.min}
              name='song-date-picker-from'
              setDate={setDateFrom}
            />
          </div>
          <div className='song-date-picker-to'>
            <label>Til dato</label>
            <DatePicker
              min={minMaxDates.min}
              max={minMaxDates.max}
              value={dateTo}
              resetValue={minMaxDates.max}
              name='song-date-picker-to'
              setDate={setDateTo}
            />
          </div>
        </div>
      </SongControlLayout>
      <ComponentSongCardWrapper>
        <ComponentSongCardDetailsWrapper>
          <div className={isAnyFilterActive ? 'song-card-header-details' : 'song-card-header-details-unfiltered'}>
            {isAnyFilterActive ?
              <div className='song-reset-filters'>
                <button
                  type="button"
                  aria-label='Tilbakestill alle filtervalg'
                  onClick={resetFilters}
                  className={'sort-caret-button song-reset-button'}
                >
                  <ArrowCirclepathReverseIcon />
                  <span className={'sort-caret-label'}>Nullstill søk</span>
                </button>
              </div> : null
            }
            <div className='songs-played'>
              {filteredSongs.length} av {data.length} låter
            </div>
          </div>
        </ComponentSongCardDetailsWrapper>
        <ComponentSongCardHeader>
          {headers.map((header) => (
          <div className='song-card-header-col' key={header.displayName}>
            <SortCaret
              order={songSort.order}
              toggleSort={() => toggleSort(header.keyName)}
              active={songSort.attribute === header.keyName}
              className={'song-sort-caret'}
              label={header.displayName}
            />
          </div>
          ))}
        </ComponentSongCardHeader>
        {filteredSongs.slice(pageOffset, (pageOffset + songsPerPage)).map((song, index) =>
          <SongCard song={song} key={index} />
        )}
        <div className='song-items-per-page'>
        {/*  TODO dropdown valg */}
        </div>
        {totalPages > 1 && (
          <ComponentSongPaginationWrapper>
            {isMobile ?
              <IraPaginationMobile
                currentSetPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                showPages={5}
              /> :
              <IraPagination
                currentSetPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                showPages={showPages}
              />
            }
          </ComponentSongPaginationWrapper>
        )}
      </ComponentSongCardWrapper>
    </SongLayout>
  )
}

export default Songs;
