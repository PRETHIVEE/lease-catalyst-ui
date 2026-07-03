import { Link } from "react-router-dom";

import "./BreadCrumbs.scss";

export type CamBreadcrumbItem = {
  label: string;
  url?: string;
};

export type BreadCrumbsProps = {
  items: CamBreadcrumbItem[];
  currentPage: string;
  auditorName?: string;
};

const BreadCrumbs = ({ items, currentPage, auditorName }: BreadCrumbsProps) => {
  return (
    <nav aria-label="Breadcrumb" className="cam-breadcrumbs">
      <ol className="cam-breadcrumbs__trail">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="cam-breadcrumbs__item">
            {index > 0 && (
              <span className="cam-breadcrumbs__separator" aria-hidden>
                /
              </span>
            )}
            {item.url ? (
              <Link to={item.url} className="cam-breadcrumbs__link">
                {item.label}
              </Link>
            ) : (
              <span className="cam-breadcrumbs__link">{item.label}</span>
            )}
          </li>
        ))}

        {(items.length > 0 || currentPage) && (
          <li className="cam-breadcrumbs__item">
            <span className="cam-breadcrumbs__separator" aria-hidden>
              /
            </span>
            <span aria-current="page" className="cam-breadcrumbs__current">
              {currentPage}
            </span>
          </li>
        )}
      </ol>

      {auditorName && (
        <span className="cam-breadcrumbs__badge">
          Auditor: <strong>{auditorName}</strong>
        </span>
      )}
    </nav>
  );
};

export default BreadCrumbs;
