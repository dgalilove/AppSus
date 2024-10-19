import { AppNavigator } from "../../../cmps/AppNavigator"
const { useEffect, useState } = React
const { useSearchParams } = ReactRouterDOM

export function NoteFilter({ filterBy, onSetFilterBy }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
  const [isHidden, setIsHidden] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const searchFromParams = searchParams.get("search") || ""
    const typeFromParams = searchParams.get("filterType") || ""
    setFilterByToEdit((prevFilter) => ({
      ...prevFilter,
      title: searchFromParams,
      type: typeFromParams,
    }))
  }, [])

  useEffect(() => {
    onSetFilterBy(filterByToEdit)
    const newSearchParams = new URLSearchParams()
    if (filterByToEdit.title)
      newSearchParams.set("search", filterByToEdit.title)
    if (filterByToEdit.type)
      newSearchParams.set("filterType", filterByToEdit.type)
    setSearchParams(newSearchParams, { replace: true })
  }, [filterByToEdit])

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target
    const newValue =
      type === "checkbox"
        ? checked
        : type === "number" || type === "range"
          ? +value
          : value
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [name]: newValue }))
  }

  const { title, type } = filterByToEdit

  return (
    <section className="note-filter ">
      <div className="logo-and-search">
        <svg
          className="keep-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 370.86 509.93"
        >
          <defs>
            <style>
              {`.cls-1{fill:#ffba00;}.cls-2{fill:#ff9500;}.cls-3{fill:#fff;}`}
            </style>
          </defs>
          <path
            className="cls-1"
            d="M336.09,509.93H34.77A34.72,34.72,0,0,1,0,475.16V34.77A34.72,34.72,0,0,1,34.77,0H243.38L370.86,127.48V475.16A34.72,34.72,0,0,1,336.09,509.93Z"
          />
          <path className="cls-2" d="M243.38,0,370.86,127.48H243.38Z" />
          <path className="cls-3" d="M226,341.88H144.87v29H226Z" />
          <path
            className="cls-3"
            d="M185.43,173.84a75.31,75.31,0,0,0-40.1,139.07h80a75.31,75.31,0,0,0-40.1-139.07Z"
          />
        </svg>
        <form>
          <input
            value={title || ""}
            onChange={handleChange}
            type="text"
            name="title"
            className="title-filter"
            placeholder="Filter by title"
          />
          <select
            name="type"
            value={type}
            onChange={handleChange}
            aria-label="Filter by type"
          >
            <option value="">All</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="todos">Todos</option>
          </select>
        </form>
      </div>
      <div className="dots-and-account">
        <div className="navigator-container">
          <img
            onClick={() => setIsHidden(!isHidden)}
            className="dots"
            src="./assets/css/apps/note/note-svgs/dot-library-light.svg"
            alt=""
          />
          <AppNavigator isHidden={isHidden} />
        </div>
        <img
          className="account-logo"
          src="./assets/css/apps/mail/mail-svgs/account-logo.jpeg"
          alt=""
        />
      </div>
    </section>
  )
}
