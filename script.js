document.getElementById("toggle-menu").addEventListener("click", function () {
  document.body.classList.toggle("menu-open");
});

const maxShowItem = 5;
document.querySelectorAll(".glider-container").forEach((element, index) => {
  const items = element.querySelectorAll(".item");
  const total = items.length;
  const size = Number(element.dataset.itemPerPage);
  const totalPage = Math.ceil(total / size);
  let currentPage = 1;
  const pager = GetPager(total, currentPage, size, maxShowItem, totalPage);
  let startPage = pager.startPage;
  let endPage = pager.endPage;
  let pages = pager.pages;
  const pagination = element.querySelector(".pagination");
  const slider = element.querySelector(".glider");
  const glider = new Glider(slider, {
    duration: 0.25,
    draggable: false
  });
  slider.addEventListener("glider-animated", function () {
    pagination.innerHTML = "";
    currentPage = glider.getCurrentSlide() + 1;
    const activeItem = element.querySelector(".glider-slide.active");
    const activeItemHeight = activeItem.getBoundingClientRect().height + 64;
    element.querySelector(
      ".glider-track"
    ).style.height = `${activeItemHeight}px`;
    const newPager = GetPager(total, currentPage, size, maxShowItem, totalPage);
    startPage = newPager.startPage;
    endPage = newPager.endPage;
    pages = newPager.pages;
    renderPagination();
  });
  function scrollTopEl() {
    if (window.innerWidth < 1024) {
      const scrollTop = element.getBoundingClientRect().top + window.scrollY - 32;
      window.scrollTo(0, scrollTop);
    }
  }
  function renderPrevNext(type) {
    const prev = document.createElement("div");
    const isPrev = type === "prev";
    const isHide =
      (isPrev && currentPage <= 1) || (!isPrev && currentPage >= totalPage);
    prev.className = `cursor-pointer w-8 h-8 flex items-center justify-center rounded-full border border-[#C7C7C7] ${
      isPrev ? "transform rotate-180" : ""
    } ${isHide ? "opacity-0 pointer-events-none" : ""}`;
    const prevIcon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const prevUseElem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use"
    );
    prevUseElem.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      "/images/sprites.svg#arrow"
    );
    prevIcon.setAttribute("width", "9");
    prevIcon.setAttribute("height", "15");
    prevIcon.setAttribute("viewBox", "0 0 16 28");
    prevIcon.appendChild(prevUseElem);
    prev.addEventListener("click", () => {
      const current = glider.getCurrentSlide();
      const newPage = isPrev ? current - 1 : current + 1;
      glider.scrollItem(newPage);
      scrollTopEl();
    });
    prev.append(prevIcon);
    return prev;
  }
  function renderPagination() {
    const prev = renderPrevNext("prev");
    pagination.append(prev);
    if (startPage > 1) {
      const firstPage = document.createElement("div");
      firstPage.className =
        "cursor-pointer w-[38px] h-[38px] flex items-center justify-center rounded-full border border-[#C7C7C7]";
      firstPage.innerHTML = 1;
      firstPage.addEventListener("click", () => {
        glider.scrollItem(0);
        scrollTopEl();
      });
      pagination.append(firstPage);
      if (startPage > 2) {
        const threeDots = renderThreeDots();
        pagination.append(threeDots);
      }
    }
    pages.forEach((page) => {
      const paginate = document.createElement("div");
      paginate.className = `cursor-pointer w-[38px] h-[38px] flex items-center justify-center rounded-full border ${
        currentPage === page
          ? "bg-[#E4F7FF] text-[#279BCD] border-[#279BCD]"
          : "border-[#C7C7C7]"
      }`;
      paginate.innerText = page;
      paginate.addEventListener("click", () => {
        glider.scrollItem(page - 1);
        scrollTopEl();
      });
      pagination.append(paginate);
    });
    if (endPage < totalPage - 1) {
      const threeDots = renderThreeDots();
      pagination.append(threeDots);
    }
    if (endPage < totalPage) {
      const lastPage = document.createElement("div");
      lastPage.className =
        "cursor-pointer w-[38px] h-[38px] flex items-center justify-center rounded-full border border-[#C7C7C7]";
      lastPage.innerHTML = totalPage;
      lastPage.addEventListener("click", () => {
        glider.scrollItem(totalPage - 1);
        scrollTopEl();
      });
      pagination.append(lastPage);
    }
    const next = renderPrevNext("next");
    pagination.append(next);
  }
  renderPagination();
});

function renderThreeDots() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const useElem = document.createElementNS("http://www.w3.org/2000/svg", "use");
  useElem.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "/images/sprites.svg#three-dots"
  );
  svg.setAttribute("width", "26");
  svg.setAttribute("height", "28");
  svg.setAttribute("viewBox", "0 0 26 28");
  svg.appendChild(useElem);

  return svg;
}

function GetPager(
  totalItems,
  currentPage,
  pageSize,
  paginationSize,
  totalPage
) {
  const distance = Math.floor(paginationSize / 2);
  currentPage = currentPage || 1;

  const totalPages = totalPage || Math.ceil(totalItems / pageSize);

  let startPage, endPage;

  if (totalPages <= paginationSize) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= Math.ceil(paginationSize / 2)) {
      startPage = 1;
      endPage = paginationSize;
    } else if (currentPage + distance >= totalPages) {
      startPage = totalPages - (paginationSize - 1);
      endPage = totalPages;
    } else {
      startPage = currentPage - distance;
      endPage = currentPage + distance;
    }
  }

  let pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return {
    totalPages,
    startPage,
    endPage,
    pages,
  };
}
