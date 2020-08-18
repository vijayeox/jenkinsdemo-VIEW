import LeftMenuTemplate from "./src/LeftMenuTemplate";
import Notification from "./src/Notification";
import React, { lazy } from 'react'
import ReactDOM from 'react-dom'
import './index.scss';
import DateComponent from "./src/components/DateComponent.js";
import CurrencySelect from "./src/components/Currency Select/currencySelect";
import countryStateList from "./src/components/data/country-state-codes";
import * as ReactWebTabs from "react-web-tabs";
import * as ReactBootstrap from "react-bootstrap";
import * as KendoReactButtons from "@progress/kendo-react-buttons";

const OX_Grid = lazy(() => import("./src/OX_Grid"));
const GridTemplate = lazy(() => import("./src/GridTemplate"));
const DashboardManager = lazy(() => import("./src/DashboardManager"));
const Dashboard = lazy(() => import("./src/Dashboard"));
const DataSource = lazy(() => import("./src/DataSource"));
const Query = lazy(() => import("./src/Query"));
const DashboardFilter = lazy(() => import("./src/DashboardFilter"));
const WidgetGrid = lazy(() => import("./src/WidgetGrid"));
const WidgetRenderer = lazy(() => import("./src/WidgetRenderer"));
const FormRender = lazy(() => import("./src/components/App/FormRender"));
const FormBuilder = lazy(() => import("./src/components/App/FormBuilder"));
const MultiSelect = lazy(() => import("./src/MultiSelect"));
const FileUploader = lazy(() => import("./src/FileUploader"));
const HTMLViewer = lazy(() => import("./src/components/App/HTMLViewer"));
const CommentsView = lazy(() => import("./src/components/App/CommentsView"));
const DocumentViewer = lazy(() => import("./src/DocumentViewer"));
const DateFormats  = lazy(() => import('./src/public/js/DateFormats.js'));
const DropDown  = lazy(() => import('./src/components/Dropdown/DropDownList'));
const PhoneInput  = lazy(() => import('react-phone-number-input'));
const ReactStrap = lazy(() => import("reactstrap"));
const Webcam = lazy(() => import("react-webcam"));
const KendoReactEditor = lazy(() => import("@progress/kendo-react-editor"));
const KendoReactDateInputs = lazy(() => import("@progress/kendo-react-dateinputs"));
const KendoReactPopup = lazy(() => import("@progress/kendo-react-popup"));
const KendoReactDropDowns = lazy(() => import("@progress/kendo-react-dropdowns"));
const KendoDataQuery = lazy(() => import("@progress/kendo-data-query"));
const KendoReactWindow = lazy(() => import("@progress/kendo-react-dialogs"));
const KendoReactGrid = lazy(() => import("@progress/kendo-react-grid"));
const KendoReactInput = lazy(() => import("@progress/kendo-react-inputs"));
const KendoReactRipple = lazy(() => import("@progress/kendo-react-ripple"));
const PopupDialog = lazy(() => import('sweetalert2'));
const Moment = lazy(() => import("moment"));
const MomentTZ = lazy(() => import("moment-timezone"));
const AvatarImageCropper  = lazy(() =>  import("react-avatar-image-cropper"));

export {
  LeftMenuTemplate,
  GridTemplate,
  Notification,
  MultiSelect,
  FileUploader,
  HTMLViewer,
  CommentsView,
  FormRender,
  OX_Grid,
  DocumentViewer,
  DashboardManager,
  Dashboard,
  WidgetGrid,
  WidgetRenderer,
  DataSource,
  Query,
  DashboardFilter,
  React,
  ReactDOM,
  DateFormats,
  AvatarImageCropper,
  ReactStrap,
  ReactBootstrap,
  ReactWebTabs,
  Webcam,
  KendoReactEditor,
  KendoReactDateInputs,
  KendoReactPopup,
  KendoReactDropDowns,
  KendoDataQuery,
  KendoReactButtons,
  KendoReactWindow,
  KendoReactGrid,
  KendoReactInput,
  KendoReactRipple,
  PopupDialog,
  Moment,
  MomentTZ,
  PhoneInput,
  DateComponent,
  DropDown,
  CurrencySelect,
  countryStateList,
  FormBuilder
};