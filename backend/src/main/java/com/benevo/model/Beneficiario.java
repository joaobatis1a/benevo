package com.benevo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "beneficiarios")
public class Beneficiario {
    @Id
    private String id;
    private String nome; // Nome Completo
    private String email; // Opcional
    private String telefone; // Opcional
    
    // Novo campo chave
    private String bairroCidade; // Ex: "Boa Viagem - Recife"
    
    private String idBenevo; // ID gerado
    private String status;   // "Pendente" ou "Aprovado"
    
    // Segurança Customizada
    private String perguntaSeguranca; // Agora é livre, não enum
    private String respostaSeguranca;
    
    private List<String> categoriasInteresse;

    public Beneficiario() {}

    public Beneficiario(String nome, String email, String telefone, String bairroCidade, String perguntaSeguranca, String respostaSeguranca, List<String> categoriasInteresse) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.bairroCidade = bairroCidade;
        this.perguntaSeguranca = perguntaSeguranca;
        this.respostaSeguranca = respostaSeguranca;
        this.categoriasInteresse = categoriasInteresse;
    }

    // Getters e Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public String getBairroCidade() { return bairroCidade; }
    public void setBairroCidade(String bairroCidade) { this.bairroCidade = bairroCidade; }
    public String getIdBenevo() { return idBenevo; }
    public void setIdBenevo(String idBenevo) { this.idBenevo = idBenevo; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPerguntaSeguranca() { return perguntaSeguranca; }
    public void setPerguntaSeguranca(String perguntaSeguranca) { this.perguntaSeguranca = perguntaSeguranca; }
    public String getRespostaSeguranca() { return respostaSeguranca; }
    public void setRespostaSeguranca(String respostaSeguranca) { this.respostaSeguranca = respostaSeguranca; }
    public List<String> getCategoriasInteresse() { return categoriasInteresse; }
    public void setCategoriasInteresse(List<String> categoriasInteresse) { this.categoriasInteresse = categoriasInteresse; }
}