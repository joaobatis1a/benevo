package com.benevo;

import com.benevo.model.Item;
import com.benevo.repository.ItemRepository;
import com.benevo.service.ItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ItemServiceTest {

    @Autowired
    private ItemService itemService;

    @Autowired
    private ItemRepository itemRepository;

    @BeforeEach
    void cleanupDatabase() {
        System.out.println("\n🧹 --- LIMPANDO O BANCO DE DADOS (ANTES DO TESTE) ---");
        itemRepository.deleteAll();
    }

    @Test
    void testRegistrarEVerificarConsultaNoOutput() {
        System.out.println("\n🚀 --- INICIANDO: testRegistrarEVerificarConsultaNoOutput ---");

        // 1️⃣ Criar item
        Item itemParaSalvar = new Item(
                null,
                "Camiseta Regata (Teste Consulta)",
                "Vestimenta",
                "5",
                "G",
                "Camiseta para mostrar no output."
        );
        System.out.println("🧩 Criando item: " + itemParaSalvar);

        // 2️⃣ Salvar item
        Item itemSalvo = itemService.registrarItem(itemParaSalvar);
        System.out.println("✅ Item salvo com ID: " + itemSalvo.getId());

        // 3️⃣ Consultar todos os itens
        List<Item> itensNoBanco = itemRepository.findAll();
        System.out.println("📦 Quantidade de itens encontrados: " + itensNoBanco.size());

        // 4️⃣ Validação
        assertFalse(itensNoBanco.isEmpty(), "O banco não deveria estar vazio após salvar.");

        // 5️⃣ Exibir itens
        System.out.println("\n🧾 --- RESULTADO DA CONSULTA (findAll) ---");
        for (Item item : itensNoBanco) {
            System.out.println("➡️ " + item);
        }
        System.out.println("🏁 --- FIM DO TESTE: testRegistrarEVerificarConsultaNoOutput ---");
    }

    @Test
    void testRegistrarItem_ComDadosValidos_DeveSalvarItemNoMongoDB() {
        System.out.println("\n🔧 --- testRegistrarItem_ComDadosValidos_DeveSalvarItemNoMongoDB ---");

        Item itemParaSalvar = new Item(null, "Camiseta Branca", "Vestimenta", "3", "M", "Camiseta de algodão.");
        Item itemSalvo = itemService.registrarItem(itemParaSalvar);

        assertNotNull(itemSalvo);
        assertNotNull(itemSalvo.getId());

        System.out.println("✅ Item salvo com sucesso: " + itemSalvo);

        Optional<Item> itemDoBanco = itemRepository.findById(itemSalvo.getId());
        assertTrue(itemDoBanco.isPresent());
        System.out.println("🔎 Item encontrado no banco: " + itemDoBanco.get());
    }

    @Test
    void testRegistrarItem_ComNomeNulo_DeveLancarExcecaoENaoSalvar() {
        System.out.println("\n⚠️ --- testRegistrarItem_ComNomeNulo_DeveLancarExcecaoENaoSalvar ---");

        Item itemInvalido = new Item(null, null, "Roupa", "Novo", "M", "Descrição.");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            itemService.registrarItem(itemInvalido);
        });

        System.out.println("❌ Exceção lançada corretamente: " + exception.getMessage());
        assertEquals("O nome do item é obrigatório.", exception.getMessage());
        assertEquals(0, itemRepository.count());
    }

    @Test
    void testBuscarPorId_QuandoItemExiste_DeveRetornarItem() {
        System.out.println("\n🔍 --- testBuscarPorId_QuandoItemExiste_DeveRetornarItem ---");

        Item itemSetup = new Item(null, "Item de Teste", "Categoria", "Novo", "P", "Desc");
        Item itemSalvo = itemRepository.save(itemSetup);
        System.out.println("💾 Item salvo manualmente: " + itemSalvo);

        Optional<Item> itemEncontrado = itemService.buscarPorId(itemSalvo.getId());
        assertTrue(itemEncontrado.isPresent());
        System.out.println("✅ Item encontrado via serviço: " + itemEncontrado.get());
    }

    @Test
    void testBuscarPorId_QuandoItemNaoExiste_DeveRetornarVazio() {
        System.out.println("\n🚫 --- testBuscarPorId_QuandoItemNaoExiste_DeveRetornarVazio ---");

        String idFalso = "60c72b9fffb4e0001f000001";
        Optional<Item> itemEncontrado = itemService.buscarPorId(idFalso);

        assertTrue(itemEncontrado.isEmpty());
        System.out.println("✅ Nenhum item encontrado (como esperado).");
    }
}
