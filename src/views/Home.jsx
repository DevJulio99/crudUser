import * as React from "react";
import { createUsers, deleteUsers, editUsers, getUsers } from "../services/ServiceUser";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "./Home.css";
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const columns = [
  { id: "numeroDocumento", label: "Numero de Documento", minWidth: 100 },
  { id: "nombre", label: "Nombre", minWidth: 170 },
  {
    id: "celular",
    label: "Celular",
    minWidth: 170,
  },
];

function createData(numeroDocumento, nombre, celular) {
  return { numeroDocumento, nombre, celular };
}

function Home() {
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rowUser, setRowsUser] = React.useState([]);

  const [openDelete, setOpenDelete] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState(false);
  const [numberDoc, setNumberDoc] = React.useState("");

  const [userData, setUserData] = React.useState({
    numeroDocumento: "",
    nombre: "",
    celular: "",
  });

  const handleClickDelete = (numberDoc) => {
    setNumberDoc(numberDoc);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setNumberDoc("");
  };

  const handleClickEdit = (dataUser) => {
    setNewStatus(false);
    setUserForm(dataUser.numeroDocumento, dataUser.nombre, dataUser.celular);
    setOpenEdit(true);
  };

  const handleClickNew = () => {
    setNewStatus(true);
    setUserForm();
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setUserForm();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadData = async () => {
    const result = await getUsers();
    console.log("result", result);
    if (result && result.success) setRowsUser(result.data);
    if (result && !result.success) {
      Swal.fire({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
    setLoading(false);
  };

  const setUserForm = (numeroDocumento = "", nombre = "", celular = "") => {
    setUserData({
      numeroDocumento,
      nombre,
      celular,
    });
  };

  const changeUserInput = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleForm = async (formUser) => {
    if(newStatus) {
      createUser(formUser);
    }

    if(!newStatus){
      editUser(formUser);
    }
  };

  const createUser = async(formUser) => {
    const result = await createUsers(formUser);
    console.log("result create", result);
    if (result) {
      if (result.success) {
        Swal.fire({
          title: "Ok",
          text: "Se registro el usuario",
          icon: "success",
          confirmButtonText: "Continuar",
        });
        loadData();
      } else {
        Swal.fire({
          title: `${result?.messages ? `${result.messages.toString()}` : 'Error!'}`,
          html: `
             ${result?.validations && result?.validations.length ? `
             
             <ul class="list-error">
               ${result?.validations.map(x => `<li>${x.messages.toString()}</li>`)}
             </ul>
             
             ` : 'Ocurrio un error'}
          `,
          icon: "error",
          confirmButtonText: "Ok",
          willClose: () => {
            setOpenEdit(true);
            setUserData(formUser);
          }
        });
      }
    }
  }

  const editUser = async(formUser) => {
    const result = await editUsers(formUser);
    console.log("result edit", result);
    if (result) {
      if (result.success) {
        Swal.fire({
          title: "Ok",
          text: "Se Edito el usuario",
          icon: "success",
          confirmButtonText: "Continuar",
        });
        loadData();
      } else {
        Swal.fire({
          title: `${result?.messages ? `${result.messages.toString()}` : 'Error!'}`,
          html: `
             ${result?.validations && result?.validations.length ? `
             
             <ul class="list-error">
               ${result?.validations.map(x => `<li>${x.messages.toString()}</li>`)}
             </ul>
             
             ` : 'Ocurrio un error'}
          `,
          icon: "error",
          confirmButtonText: "Ok",
          willClose: () => {
            setOpenEdit(true);
            setUserData(formUser);
          }
        });
      }
    }
  }

  const deleteUser = async() => {
    const result = await deleteUsers(numberDoc);
    console.log("result delete", result);
    if (result) {
      if (result.success) {
        Swal.fire({
          title: "Ok",
          text: "Se Elimino el usuario",
          icon: "success",
          confirmButtonText: "Continuar",
        });
        handleCloseDelete();
        loadData();
      } else {
        Swal.fire({
          title: `${result?.messages ? `${result.messages.toString()}` : 'Error!'}`,
          html: `
             ${result?.validations && result?.validations.length ? `
             
             <ul class="list-error">
               ${result?.validations.map(x => `<li>${x.messages.toString()}</li>`)}
             </ul>
             
             ` : 'Ocurrio un error'}
          `,
          icon: "error",
          confirmButtonText: "Ok"
        });
      }
    }
  }

  React.useEffect(() => {
    loadData();
  }, []);
  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell key={"actions"} align={"center"}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            style={{
              position: "relative",
              height: `${loading || !rowUser.length ? "145px" : "auto"}`,
            }}
          >
            {loading ? (
              <div className="box-loader">
                <Box>
                  <CircularProgress />
                </Box>
              </div>
            ) : null}

            {!loading && !rowUser.length ? (
              <div className="hidden-user">Sin registros</div>
            ) : null}
            {rowUser
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                    <TableCell key={"actions"} align={"center"}>
                      <Tooltip
                        title="Eliminar Usuario"
                        onClick={() => handleClickDelete(row.numeroDocumento)}
                      >
                        <IconButton aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title="Editar Usuario"
                        onClick={() => handleClickEdit(row)}
                      >
                        <IconButton aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          display: "flex",
          justifyContent: "right",
          marginTop: "15px",
        }}
      >
        <Button variant="contained" onClick={handleClickNew}>
          Nuevo Usuario
        </Button>
      </div>

      <Dialog
        open={openDelete}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDelete}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Desea eliminar usuario?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Se eliminara el usuario permanentemente
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteUser}>Eliminar</Button>
          <Button onClick={handleCloseDelete}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());

            console.log(formJson);
            handleCloseEdit();
            handleForm(formJson);
          },
        }}
      >
        <DialogTitle>{newStatus ? "Nuevo" : "Editar"} Usuario</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="numeroDocumento"
            label="Numero de Documento"
            type="text"
            fullWidth
            variant="standard"
            inputProps={{ maxLength: 8 }}
            value={userData.numeroDocumento}
            onChange={(e) => {
              const numbers = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
              ];
              if (
                e.target.value.trim().length &&
                !numbers.includes(e.target.value.split("").pop())
              )
                return;
              changeUserInput(e);
            }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="nombre"
            name="nombre"
            label="Nombre"
            type="text"
            fullWidth
            variant="standard"
            value={userData.nombre}
            onChange={changeUserInput}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="celular"
            name="celular"
            label="Celular"
            type="text"
            fullWidth
            variant="standard"
            value={userData.celular}
            inputProps={{ maxLength: 9 }}
            onChange={(e) => {
              const numbers = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
              ];
              if (
                e.target.value.trim().length &&
                !numbers.includes(e.target.value.split("").pop())
              )
                return;
              changeUserInput(e);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
