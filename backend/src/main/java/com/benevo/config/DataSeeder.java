// package com.benevo.config;

// import com.benevo.model.Usuario;
// import com.benevo.repository.UsuarioRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.security.crypto.password.PasswordEncoder; // Importante
// import org.springframework.stereotype.Component;

// @Component
// public class DataSeeder implements CommandLineRunner {

//     @Autowired
//     private UsuarioRepository usuarioRepository;

//     @Autowired
//     private PasswordEncoder passwordEncoder; // Injeta o criptografador

//     @Override
//     public void run(String... args) throws Exception {
        
//         // Verifica se o admin já existe. Se não, cria com SENHA CRIPTOGRAFADA.
//         if (usuarioRepository.findByLogin("admin").isEmpty()) {
            
//             // AQUI ESTÁ A CORREÇÃO: encode("123")
//             String senhaHash = passwordEncoder.encode("123");
            
//             usuarioRepository.save(new Usuario(null, "admin", senhaHash, "ADMIN"));
//             System.out.println(">>> DATA SEEDER: Admin criado com senha criptografada!");
//         } else {
//             // Opcional: Se o admin já existe mas está com a senha errada (texto plano),
//             // você pode forçar a atualização descomentando as linhas abaixo:
            
//             Usuario admin = usuarioRepository.findByLogin("admin").get();
//             admin.setSenha(passwordEncoder.encode("123"));
//             usuarioRepository.save(admin);
//             System.out.println(">>> DATA SEEDER: Senha do Admin atualizada para BCrypt!");
//         }
//     }
// }