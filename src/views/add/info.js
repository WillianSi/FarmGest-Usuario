import React, { useState } from "react";
import AuthenticatedLayout from "services/AuthenticatedLayout.js";
import Paginations from "../../components/Pagination/paginations.js";
import {
  Modal,
  Button,
  Form,
  Input,
  FormGroup,
  Table,
  Row,
  Col,
  Container,
  ModalBody,
} from "reactstrap";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FilterSearchBar } from "../filter/filters.js";

const Info = (props) => {
  const { medication } = props;

  const [searchValue, setSearchValue] = useState("");

  const [showLoteInfo, setShowLoteInfo] = useState(false);
  const [data] = useState({
    nome: medication.dataMedications.nome || "",
    via_administracao: medication.dataMedications.via_administracao || "",
    tipo_Medicamento: medication.dataMedications.tipo_Medicamento || "",
    classe_farmacologica: medication.dataMedications.classe_farmacologica || "",
    faixa_etaria: medication.dataMedications.faixa_etaria || "",
    status: medication.dataMedications.status || "",
    contraindicacoes: medication.dataMedications.contraindicacoes || "",
    dosage: {
      numeroDosagem: medication.dataMedications.dosage.numeroDosagem || "",
      unidadeDosagem: medication.dataMedications.dosage.unidadeDosagem || "",
    },
    quantidade: {
      quantidadeEstoque:
        medication.dataMedications.quantidade.quantidadeEstoque || "",
      unidadeEstoque:
        medication.dataMedications.quantidade.unidadeEstoque || "",
    },
  });

  const [lot] = useState(
    medication.lotMedications.map((lotMedication, index) => ({
      id: index + 1,
      numero: lotMedication.numero || "",
      validade: lotMedication.validade || "",
      quantidade: lotMedication.quantidade || "",
      unidade: lotMedication.unidade || "",
    }))
  );

  const sortedLot = lot
    .slice()
    .sort((a, b) => new Date(b.validade) - new Date(a.validade));

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedLot.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value.toLowerCase());
  };

  const filteredItems = currentItems.filter((item) =>
    item.numero.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      className={"max-width-50vw"}
    >
      <AuthenticatedLayout>
        <ModalBody>
          <Form>
            <h6 className="heading-small text-muted mb-4">
              Informação do Medicamento
            </h6>
            <Row>
              <Col lg="6">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-nome">
                    Nome do Medicamento
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-nome"
                    type="text"
                    name="nome"
                    value={data.nome}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-via-administracao"
                  >
                    Via de administração
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-via-administracao"
                    name="via_administracao"
                    value={data.via_administracao}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="tipo-Medicamento"
                  >
                    Tipo de Medicamento
                  </label>
                  <Input
                    className="form-control form-control-alternative"
                    id="tipo-Medicamento"
                    name="tipo_Medicamento"
                    value={data.tipo_Medicamento}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-classe-farmacologica"
                  >
                    Classe Farmacológica
                  </label>
                  <Input
                    className="form-control form-control-alternative"
                    id="input-classe-farmacologica"
                    name="classe_farmacologica"
                    value={data.classe_farmacologica}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label className="form-control-label" htmlFor="numeroDosagem">
                    Dosagem
                  </label>
                  <div className="d-flex">
                    <input
                      className="form-control form-control-alternative"
                      type="number"
                      id="numeroDosagem"
                      name="numeroDosagem"
                      value={data.dosage.numeroDosagem}
                      disabled
                    />
                    <Input
                      className="form-control form-control-alternative ml-1"
                      name="unidadeDosagem"
                      value={data.dosage.unidadeDosagem}
                      disabled
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-faixa-etaria"
                  >
                    Restrição de Uso por Faixa Etária
                  </label>
                  <Input
                    className="form-control form-control-alternative"
                    id="input-faixa-etaria"
                    name="faixa_etaria"
                    value={data.faixa_etaria}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="quantidadeEstoque"
                  >
                    Quantidade em Estoque
                  </label>
                  <div className="d-flex">
                    <Input
                      className="form-control form-control-alternative"
                      type="number"
                      id="quantidadeEstoque"
                      name="quantidadeEstoque"
                      value={data.quantidade.quantidadeEstoque}
                      disabled
                    />
                    <Input
                      className="form-control form-control-alternative ml-1"
                      name="unidadeEstoque"
                      value={data.quantidade.unidadeEstoque}
                      disabled
                    />
                  </div>
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-status">
                    Status
                  </label>
                  <Input
                    className="form-control form-control-alternative"
                    id="input-status"
                    name="status"
                    value={data.status}
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-contraindicacoes"
                  >
                    Contraindicações
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-contraindicacoes"
                    type="textarea"
                    name="contraindicacoes"
                    value={data.contraindicacoes}
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
            <hr className="my-4" />
            <div
              onClick={() => setShowLoteInfo(!showLoteInfo)}
              style={{ cursor: "pointer" }}
            >
              <h6
                className={`heading-small text-muted mb-0 ${
                  showLoteInfo ? "text-primary" : "text-blue"
                }`}
              >
                Informação do Lote
                <span>&nbsp;</span>
                {showLoteInfo ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </h6>
            </div>
            <div style={{ marginBottom: "20px" }}></div>
            {showLoteInfo && (
              <FormGroup>
                <div style={{ width: "250px" }}>
                  <FilterSearchBar
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </div>
                <Container>
                  <div style={{ overflowX: "auto" }}>
                    <Table bordered>
                      <thead>
                        <tr style={{ textAlign: "center" }}>
                          <th>Número do Lote</th>
                          <th>Validade</th>
                          <th>Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <Input
                                type="text"
                                id={`numeroLote_${index}`}
                                value={item.numero}
                                className="form-control"
                                disabled
                              />
                            </td>
                            <td>
                              <Input
                                type="date"
                                id={`validade_${index}`}
                                value={item.validade}
                                className="form-control"
                                disabled
                              />
                            </td>
                            <td>
                              <div className="d-flex">
                                <Input
                                  className="form-control form-control-alternative"
                                  style={{ minWidth: "70px" }}
                                  type="number"
                                  id={`quantidade_${index}`}
                                  value={item.quantidade}
                                  disabled
                                />
                                <Input
                                  className="form-control form-control-alternative ml-1"
                                  style={{ minWidth: "50px" }}
                                  id={`unidade_${index}`}
                                  name="unidade"
                                  value={item.unidade}
                                  disabled
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Paginations
                      itemsPerPage={itemsPerPage}
                      totalItems={sortedLot.length}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </Container>
              </FormGroup>
            )}
            <div className="text-right">
              <Button color="danger" onClick={props.toggle}>
                Fechar
              </Button>
            </div>
          </Form>
        </ModalBody>
      </AuthenticatedLayout>
    </Modal>
  );
};

export default Info;
