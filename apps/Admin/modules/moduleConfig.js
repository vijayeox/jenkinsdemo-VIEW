import {React} from "oxziongui";
import DialogContainerAnnouncement from "./dialog/DialogContainerAnnouncement";

export default {
  Organization: {},
  User: {},
  Announcement: {
    title: "Manage Announcements",
    dialogWindow: DialogContainerAnnouncement,
    listConfig: {
      route: "announcements",
      toolbarTemplate: (
        <h5 key={1} style={{ margin: "0px" }}>
          Announcements List
        </h5>
      ),
      addButton: { title: "Create Announcement" },
      columnConfig: [
        {
          title: "Banner",
          filterCell: {
            type: "empty"
          },
          width: "150px",
          sortable: false,
          cell:
            '{item.media_type=="image"?<td className="tdImage"><img className="text-center circle gridBanner" src={baseUrl+"resource/"+item.media+"?"+new Date()} alt="Logo"/></td>:<td className="flexColCenter"><video className="text-center circle gridBanner"><source src={baseUrl+"resource/"+item.media+"?"+new Date()} type="video/mp4"/></video></td>}'
        },
        {
          title: "Name",
          field: "name"
        },
        {
          title: "Description",
          field: "description",
          cell:
            '<td>{item.description ? item.description.slice(0, 150) + "..." : "No Description Added"}</td>'
        },
        {
          title: "Type",
          field: "type",
          filterCell: {
            type: "dropdown",
            listItems: ["ANNOUNCEMENT", "HOMESCREEN"],
            placeholder: "Select Type"
          }
        }
      ],
      actions: [
        { name: "Edit", type: "edit", icon: "fa fa-pencil" },
        { name: "Add To Group", type: "assignEntity", icon: "fa fa-users" },
        { name: "Delete", type: "delete", icon: "fa fa-trash manageIcons" }
      ]
    },
    permission: {
      canAdd: "MANAGE_ANNOUNCEMENT_WRITE",
      canEdit: "MANAGE_ANNOUNCEMENT_WRITE",
      canDelete: "MANAGE_ANNOUNCEMENT_WRITE"
    }
  },
  Group: {}
};
