import React from 'react';

const CaseStudyFilter = (props) => {
  const {
    filterTitle,
    filters,
    activeFilters,
    setActiveFilters,
    filterName,
  } = props;

  const showInputs = (event) => {
    event.currentTarget.parentElement.classList.add('active');
    // debugger;
  };

  return (
    <div className="filter-wrapper">
      <button
        className="ui basic button facet-btn"
        onClick={(e) => showInputs(e)}
        handleKeyDown={() => {}}
      >
        <span>
          {filterTitle}
          <i aria-hidden="true" className="icon angle down"></i>
        </span>
      </button>
      <div className="filter-inputs-wrapper">
        {Object.entries(filters?.[filterName] || {}).length > 7 ? (
          <input
            type="text"
            className="filterInputText"
            onKeyUp={(e) => {
              const filterValue = e.currentTarget.value.toUpperCase();
              const inputs = e.currentTarget.nextSibling.children;
              // debugger;

              for (let i = 0; i < inputs.length; i++) {
                let inputValue = inputs[i].textContent || inputs[i].innerText;
                if (inputValue.toUpperCase().indexOf(filterValue) > -1) {
                  inputs[i].style.display = 'block';
                } else {
                  inputs[i].style.display = 'none';
                }
              }
            }}
            placeholder="Quick search"
            title="Type in a name"
          />
        ) : (
          ''
        )}

        <div className="filter-inputs">
          {Object.entries(filters?.[filterName] || {})
            .sort((item1, item2) => item1[1].localeCompare(item2[1]))
            .map(([value, label], index) => (
              <label for={label + index} className="filter-input" key={index}>
                <input
                  value={value}
                  type="checkbox"
                  id={label + index}
                  onChange={(e) => {
                    const temp = JSON.parse(JSON.stringify(activeFilters));
                    if (e.target.checked) {
                      temp[filterName].push(e.target.value);
                    } else {
                      temp[filterName] = temp[filterName].filter((value) => {
                        if (value !== e.target.value) return value;
                        return null;
                      });
                    }
                    setActiveFilters(temp);
                  }}
                />
                <span>{label}</span>
              </label>
            ))}
        </div>
      </div>
    </div>
  );
};

export function CaseStudyFilters(props) {
  const { filters, activeFilters, setActiveFilters } = props;

  React.useEffect(() => {
    window.addEventListener('click', (event) => {
      const filters = document.getElementsByClassName('filter-wrapper');

      for (let i = 0; i < filters.length; i++) {
        if (!filters[i].contains(event.target)) {
          filters[i].classList.remove('active');
        }
      }
    });
  }, []);

  return (
    <>
      {/* <CaseStudyFilter
        filterTitle="Light or In-depth"
        filterName="nwrm_type"
        filters={filters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      /> */}

      <CaseStudyFilter
        filterTitle="Sectors"
        filterName="sectors"
        filters={filters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />

      <CaseStudyFilter
        filterTitle="NWRMs implemented"
        filterName="nwrms_implemented"
        filters={filters}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
    </>
  );
}

export function ActiveFilters(props) {
  const { filters, activeFilters, setActiveFilters } = props;
  const hasActiveFilters = Object.entries(activeFilters).some(
    ([filterName, filterList]) => {
      if (filterList.length > 0) {
        return true;
      }
      return false;
    },
  );

  const clearFilters = () => {
    const filterInputs = document.querySelectorAll(
      '#cse-filter .filter-input input',
    );
    for (let i = 0; i < filterInputs.length; i++) {
      filterInputs[i].checked = false;
    }
    setActiveFilters({ nwrms_implemented: [], sectors: [] });
  };

  const removeFilter = (filterName, filterCode) => {
    const temp = JSON.parse(JSON.stringify(activeFilters));
    temp[filterName] = temp[filterName].filter((value) => {
      if (value !== filterCode) return value;
      return null;
    });

    const filterInputs = document.querySelectorAll(
      '#cse-filter .filter-input input',
    );

    for (let i = 0; i < filterInputs.length; i++) {
      if (filterInputs[i].value === filterCode) {
        filterInputs[i].checked = false;
      }
    }

    setActiveFilters(temp);
  };

  return hasActiveFilters ? (
    <div className="ui segment active-filter-list">
      <div className="filter-list-header">
        <h4 className="filter-list-title">Active filters</h4>
        <button
          onClick={clearFilters}
          className="ui mini basic compact button clear-btn"
        >
          clear all
        </button>
      </div>
      <div className="filter-list-content">
        <div className="filter">
          {activeFilters.nwrms_implemented.length > 0 ? (
            <div className="filter-wrapper">
              <div className="filter-label">NWRMs implemented:</div>
              {activeFilters.nwrms_implemented.map((filterCode) => {
                const filterLabel = filters.nwrms_implemented[filterCode];
                return (
                  <div className="ui basic label filter-value">
                    <span>{filterLabel}</span>
                    <i
                      tabIndex="0"
                      onKeyPress={() => {}}
                      onClick={() => {
                        removeFilter('nwrms_implemented', filterCode);
                      }}
                      role="button"
                      className="close icon"
                    ></i>
                  </div>
                );
              })}
            </div>
          ) : (
            ''
          )}
          {activeFilters.sectors.length > 0 ? (
            <div className="filter-wrapper">
              <div className="filter-label">Sector:</div>
              {activeFilters.sectors.map((filterCode) => {
                const filterLabel = filters.sectors[filterCode];
                return (
                  <div className="ui basic label filter-value">
                    <span>{filterLabel}</span>
                    <i
                      tabIndex="0"
                      onKeyPress={() => {}}
                      onClick={() => {
                        removeFilter('sectors', filterCode);
                      }}
                      role="button"
                      className="close icon"
                    ></i>
                  </div>
                );
              })}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  ) : (
    ''
  );
}
