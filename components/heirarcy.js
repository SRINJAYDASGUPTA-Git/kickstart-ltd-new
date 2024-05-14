"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FolderIcon from "@mui/icons-material/Folder";
import FileIcon from "@mui/icons-material/InsertDriveFile";
import { IoIosArrowBack } from "react-icons/io";
import Prism from "prismjs";
import "prismjs/components/prism-c.min.js";
import "prismjs/components/prism-cpp.min.js";
import "prismjs/components/prism-java.min.js";
import "prismjs/components/prism-javascript.min.js";
import "prismjs/components/prism-python.min.js";
import "prismjs/themes/prism.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { generateFolderData, getCodeContent } from "../utils/GetData";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { Backspace } from "@mui/icons-material";
// const folderdata = await generateFolderData(storageRef);
// console.log(folderdata);

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
  const theme = useTheme();
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    ...other
  } = props;

  const styleProps = {
    "--tree-view-color":
      theme.palette.mode !== "dark" ? color : colorForDarkMode,
    "--tree-view-bg-color":
      theme.palette.mode !== "dark" ? bgColor : bgColorForDarkMode,
  };
  const customStyles = {
    color: theme.palette.mode !== "dark" ? color : colorForDarkMode,
    fill: "#ea65dd", // Set the folder icon to pink and the file icon to white
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
          }}
        >
          <Box
            component={LabelIcon}
            color="inherit"
            sx={{ mr: 1 }}
            style={customStyles}
          />
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1, color: "white" }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={styleProps}
      {...other}
      ref={ref}
    />
  );
});

const FolderTreeView = ({ storageRef }) => {
  const [folderdata, setFolderData] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);
  const [fileContent, setFileContent] = useState("");
  const [langDetect, setLangDetect] = useState("html");
  const [flg, setFlg] = useState(true);

  useEffect(() => {
    console.log(storageRef);
    generateFolderData(storageRef, false).then((data) => {
      console.log(data);
      setFolderData(data);
    });
  }, []);

  const handleItemClick = (nodeId) => {
    if (expandedItems.includes(nodeId)) {
      setFileContent("");
      setExpandedItems(expandedItems.filter((item) => item !== nodeId));
    } else {
      setExpandedItems([...expandedItems, nodeId]);
    }
  };

  if (folderdata === null) {
    return <div>Loading...</div>;
  }

  const renderTree = (nodes) => (
    <div>
      <StyledTreeItem
        nodeId={nodes.id}
        labelText={nodes.label}
        labelIcon={nodes.type === "folder" ? FolderIcon : FileIcon}
        onClick={async () => {
          if (nodes.type === "file") {
            setFlg(false);
            // Fetch and display codeContent for the file
            try {
              const result = await getCodeContent(nodes.id);
              const { langdetect, codeContent } = result;
              setFileContent(codeContent);
              setLangDetect(langdetect);
            } catch (error) {
              // Handle errors, e.g., network request failed
              console.error("Error fetching file content:", error);
            }
          } else {
            handleItemClick(nodes.id);
          }
        }}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </StyledTreeItem>
    </div>
  );

  return (
    <TreeView
      aria-label="folder"
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      expanded={expandedItems}
    >
      {flg ? (
        renderTree(folderdata)
      ) : (
        <div className="h-full w-full" style={{ marginLeft: 20 }}>
          <div className="flex">
            <button onClick={() => setFlg(true)} className="text-[#ea65dd]">
              <IoIosArrowBack size={20} />
            </button>
            <p className="ms-[10px] text-white">File Content</p>
          </div>
          <pre
            style={{ border: "1px solid black" }}
            className="h-full ms-[25px] w-full ps-[5px] pe-[5px] overflow-y-auto text-white"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(
                fileContent,
                Prism.languages[langDetect],
                langDetect
              ),
            }}
          />
        </div>
      )}
    </TreeView>
  );
};

export default FolderTreeView;