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
import * as KendoReactDropDowns from "@progress/kendo-react-dropdowns";
import * as KendoReactEditor from "@progress/kendo-react-editor";
import * as KendoReactDateInputs from "@progress/kendo-react-dateinputs";
import * as KendoReactPopup from "@progress/kendo-react-popup";
import * as KendoDataQuery from "@progress/kendo-data-query";
import * as KendoReactWindow from "@progress/kendo-react-dialogs";
import * as KendoReactGrid from "@progress/kendo-react-grid";
import * as KendoReactInput from "@progress/kendo-react-inputs";
import * as KendoReactRipple from "@progress/kendo-react-ripple";
import * as Moment from "moment";
import * as MomentTZ from "moment-timezone";
import * as PhoneInput from "react-phone-number-input";
import * as PopupDialog from 'sweetalert2';
import * as ReactStrap from "reactstrap";
import * as Webcam from "react-webcam";
import AvatarImageCropper from "react-avatar-image-cropper";

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