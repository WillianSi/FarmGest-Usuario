import React, { useEffect, useMemo, useRef, useState } from "react";
import FilterButton from "./filter/filterButton.js";
import {
  Form,
  FormGroup,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Alert,
  Button,
} from "reactstrap";

import AuthenticatedLayout from "services/AuthenticatedLayout.js";
import useAlert from "../hooks/useAlert.js";
import Info from "./add/info.js";

import Header from "components/Headers/Header.js";
import { collection, onSnapshot} from "firebase/firestore";
import { IoIosArrowForward } from "react-icons/io";
import { MdFilterAltOff } from "react-icons/md";
import { firestore } from "../services/firebaseConfig.js";

import GeneratePDFButton from "./add/generatePDF.js";

const Index = () => {
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [editarModalOpen, setEditarModalOpen] = useState(false);

  const unsubscribeRef = useRef(null);

  const buttonStyle = {
    background: "transparent",
    border: "none",
    boxShadow: "none",
    padding: "0",
  };

  const { errorMessage, alertColor, alertTitle, showAlert, handleAlert } =
    useAlert();
  const [filters, setFilters] = useState({
    status: [],
    classeFarmacologica: [],
    viaAdministracao: [],
    tipoMedicamento: [],
    unidadeDosagem: [],
    faixaEtaria: [],
    unidadeMedida: [],
  });

  useEffect(() => {
    const fetchEntireCollection = async () => {
      try {
        const inventoryRef = collection(firestore, "inventoryMedications");
        unsubscribeRef.current = onSnapshot(inventoryRef, (snapshot) => {
          const allDocs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMedications(allDocs);
        });
      } catch (error) {
        handleAlert(
          "Erro ao buscar medicamentos no banco de dados.",
          "danger",
          "Erro:"
        );
      }
    };
    fetchEntireCollection();
    return () => {
      if (
        unsubscribeRef.current &&
        typeof unsubscribeRef.current === "function"
      ) {
        unsubscribeRef.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMedications]);

  const filteredMedications = useMemo(() => {
    let filtered = medications.filter((medication) =>
      medication.dataMedications.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    if (filters.status.length > 0) {
      filtered = filtered.filter((medication) =>
        filters.status.includes(medication.dataMedications.status)
      );
    }
    if (filters.classeFarmacologica.length > 0) {
      filtered = filtered.filter((medication) =>
        filters.classeFarmacologica.includes(
          medication.dataMedications.classe_farmacologica
        )
      );
    }
    if (filters.viaAdministracao.length > 0) {
      filtered = filtered.filter((medication) =>
        filters.viaAdministracao.includes(
          medication.dataMedications.via_administracao
        )
      );
    }
    if (filters.tipoMedicamento.length > 0) {
      filtered = filtered.filter((medication) =>
        filters.tipoMedicamento.includes(
          medication.dataMedications.tipo_Medicamento
        )
      );
    }
    if (filters.unidadeDosagem.length > 0) {
      filtered = filtered.filter((medication) =>
        filters.unidadeDosagem.some((unit) =>
          unit.value.includes(medication.dataMedications.dosage.unidadeDosagem)
        )
      );
    }
    if (filters.faixaEtaria.length > 0) {
      filtered = filtered.filter((medication) =>
        filters.faixaEtaria.includes(medication.dataMedications.faixa_etaria)
      );
    }
    if (filters.unidadeMedida.length > 0) {
      filtered = filtered.filter((medication) =>
        filters.unidadeMedida.some((unit) =>
          unit.value.includes(
            medication.dataMedications.quantidade.unidadeEstoque
          )
        )
      );
    }
    return filtered;
  }, [medications, searchTerm, filters]);

  const sortedMedications = filteredMedications.sort((a, b) => {
    const nameA = a.dataMedications.nome.toUpperCase();
    const nameB = b.dataMedications.nome.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  const [selectedMedication, setSelectedMedication] = useState(null);
  const toggleEditarModal = (medicationId) => {
    const selectedMedication = filteredMedications.find(
      (medication) => medication.id === medicationId
    );
    setEditarModalOpen(!editarModalOpen);
    setSelectedMedication(selectedMedication);
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
      classeFarmacologica: [],
      viaAdministracao: [],
      tipoMedicamento: [],
      unidadeDosagem: [],
      faixaEtaria: [],
      unidadeMedida: [],
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Disponível":
        return "green";
      case "Estoque Baixo":
        return "yellow";
      case "Indisponível":
        return "red";
      default:
        return "";
    }
  };

  return (
    <>
      <AuthenticatedLayout>
        <Header />
        <Container className="mt--7" fluid>
          <div>
            <GeneratePDFButton medications={medications} />
          </div>
          <Row>
            <div className="col">
              <Card className="shadow">
                <div className="floating-alert">
                  {showAlert && (
                    <Alert color={alertColor}>
                      <strong>{alertTitle}</strong> {errorMessage}
                    </Alert>
                  )}
                </div>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <Form className="w-75">
                    <FormGroup className="mb-0">
                      <InputGroup className="input-group">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText
                            style={{
                              backgroundColor: "#11cdef",
                              borderColor: "#11cdef",
                            }}
                          >
                            <i
                              className="fas fa-search"
                              style={{ color: "white" }}
                            />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          id="searchTerm"
                          name="searchTerm"
                          style={{ borderColor: "#11cdef", color: "black" }}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Pesquisar medicamento..."
                        />
                      </InputGroup>
                    </FormGroup>
                  </Form>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ marginRight: "5px" }}>
                      <FilterButton setFilters={setFilters} filters={filters} />
                    </div>
                    <Button
                      className="btn btn-warning"
                      onClick={handleClearFilters}
                    >
                      <MdFilterAltOff size={19} />
                    </Button>
                  </div>
                </CardHeader>
                <Table
                  className="align-items-center text-center table-flush"
                  responsive
                >
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Medicamento</th>
                      <th scope="col">Classe</th>
                      <th scope="col">Dosagem</th>
                      <th scope="col">Status</th>
                      <th scope="col">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedMedications.map((medication, index) => (
                      <tr
                        key={medication.id}
                        onClick={() => {
                          toggleEditarModal(medication.id);
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <td>{medication.dataMedications.nome}</td>
                        <td>
                          {medication.dataMedications.classe_farmacologica}
                        </td>
                        <td>
                          {medication.dataMedications.dosage.numeroDosagem}/
                          {medication.dataMedications.dosage.unidadeDosagem}
                        </td>
                        <td>
                          <div
                            className={`badge ${getStatusClass(
                              medication.dataMedications.status
                            )}`}
                          >
                            {medication.dataMedications.status}
                          </div>
                        </td>
                        <td style={{ width: "50px" }}>
                          <Button style={buttonStyle}>
                            <IoIosArrowForward color="#32325d" size={20} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Row>
        </Container>
        {selectedMedication && (
          <Info
            isOpen={editarModalOpen}
            toggle={toggleEditarModal}
            handleAlert={handleAlert}
            medication={selectedMedication}
          />
        )}
      </AuthenticatedLayout>
    </>
  );
};

export default Index;
