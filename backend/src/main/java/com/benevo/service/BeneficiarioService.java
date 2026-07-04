package com.benevo.service;

import com.benevo.model.Beneficiario;
import com.benevo.repository.BeneficiarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;
import java.util.regex.Pattern;
import java.text.Normalizer;
import java.util.List;

@Service
public class BeneficiarioService {

    @Autowired
    private BeneficiarioRepository beneficiarioRepository;

    public Beneficiario registrarBeneficiario(Beneficiario benef) {
        benef.setStatus("Aprovado");
        
        // 1. Pega o nome, remove espaços extras
        String nomeLimpo = (benef.getNome() != null) ? benef.getNome().trim() : "USR";
        
        // 2. Remove acentos (Normalização)
        String nomeSemAcento = Normalizer.normalize(nomeLimpo, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        nomeSemAcento = pattern.matcher(nomeSemAcento).replaceAll("");
        
        // 3. Remove caracteres não-letras que sobraram
        nomeSemAcento = nomeSemAcento.replaceAll("[^a-zA-Z]", "");

        // 4. Pega as 3 primeiras letras (ou completa com X se for curto)
        String prefixo = "USR";
        if (nomeSemAcento.length() >= 3) {
            prefixo = nomeSemAcento.substring(0, 3).toUpperCase();
        } else {
            prefixo = (nomeSemAcento + "XXX").substring(0, 3).toUpperCase();
        }
        
        // 5. Gera 3 números aleatórios
        int numeroAleatorio = new Random().nextInt(900) + 100; // Garante 3 dígitos (100-999)
        
        // 6. Formato Final: JOA936 (Sem hífen)
        String idFacil = prefixo + numeroAleatorio;

        benef.setIdBenevo(idFacil); 
        return beneficiarioRepository.save(benef);
    }

    public String verificarCredenciaisIniciais(String idBenevo, String infoSecundaria) {
        Optional<Beneficiario> benefOpt = beneficiarioRepository.findByIdBenevo(idBenevo);

        if (benefOpt.isEmpty()) return "FAIL";
        
        Beneficiario b = benefOpt.get();
        if (!"Aprovado".equalsIgnoreCase(b.getStatus())) return "PENDENTE";

        String info = infoSecundaria.trim().toLowerCase();
        String bairroReal = (b.getBairroCidade() != null) ? b.getBairroCidade().toLowerCase() : "";
        String nomeReal = b.getNome().toLowerCase();
        
        if (bairroReal.contains(info)) return "OK"; 
        if (nomeReal.equals(info)) return "OK";
        if (nomeReal.contains(info)) return "CHALLENGE";
    
        return "FAIL";
    }

    public Optional<Beneficiario> buscarPorIdBenevo(String idBenevo) {
        return beneficiarioRepository.findByIdBenevo(idBenevo);
    }

    public boolean validarRespostaSeguranca(String idBenevo, String resposta) {
        Optional<Beneficiario> benef = beneficiarioRepository.findByIdBenevo(idBenevo);
        if (benef.isEmpty()) return false;
        return benef.get().getRespostaSeguranca().equalsIgnoreCase(resposta.trim());
    }
    
    public List<Beneficiario> buscarPorDadosGerais(String termo) {
        return beneficiarioRepository.findByNomeContainingIgnoreCaseOrBairroCidadeContainingIgnoreCase(termo, termo);
    }
}