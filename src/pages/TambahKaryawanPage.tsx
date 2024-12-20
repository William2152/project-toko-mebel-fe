import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import axios from "axios";
import { RootState } from "../../app/storeRedux";
import { useSelector } from "react-redux";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

function TambahKaryawanPage() {
  const token = useSelector((state: RootState) => state.localStorage.value);
  return <div></div>;
}

export default TambahKaryawanPage;
