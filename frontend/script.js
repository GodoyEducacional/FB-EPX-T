document.getElementById("cep").addEventListener("blur", async function () {
  const cep = this.value.replace(/\D/g, ""); // Remove todos os caracteres não numericos do CEP

  // Verifica se o CEP tem exatamente 8 digitos
  if (cep.length !== 8) {
    alert("CEP inválido, deve ter 8 Digitos");
    return; // Para o código
  }

  try {
    // Faz uma requisição para o Backend para o buscar o cep, conforme o cep digitado
    const response = await fetch(`http://localhost:3000/api/cep/${cep}`);
    if (!response.ok) {
      // Verifica se a resposta foi bem sucedida
      throw new Error("Erro ao buscar o CEP!"); // Lança um erro caso a req. falhe
    }

    // Converte a resposta da req. para JSON
    const data = await response.json();

    // Verifica se o CEP retornado pela API é inválido
    if (data.erro) {
      alert("CEP não encontrado!");
      return; // Para o código
    }

    // Preenche os campos do formulário com os dados retornados
    document.getElementById("logradouro").value = data.logradouro;
    document.getElementById("bairro").value = data.bairro;
    document.getElementById("cidade").value = data.localidade;
    document.getElementById("estado").value = data.uf;

    // Adiciona um feedback visual, alterando a cor da borda dos campos
    document.querySelectorAll(".form-group input").forEach((input) => {
      input.style.borderColor = "#6a11cb"; // Define cor roxa ao CEP for encontrado
    });
  } catch (error) {
    console.error("Erro ao buscar o CEP:", error); // Exibe o erro no console
    alert("Erro ao buscar o CEP. Verifique o console!");
  }
});

// Adiciona o envio da informaçãio ao DB
document
  .getElementById("adressForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Impende o carregamento da página ao enviar o Formulário

    // Obtém os valores dos campos do formulário
    const cep = document.getElementById("cep").value;
    const logradouro = document.getElementById("logradouro").value;
    const bairro = document.getElementById("bairro").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;

    try {
      // Faz uma requisição POST para o Backend para salvar o endereço
      const response = await fetch("http://localhost:3000/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Define o envio do conteudo como JSON
        },
        body: JSON.stringify({ cep, logradouro, bairro, cidade, estado }), // Envia as infor.
      });

      if (!response.ok) {
        // Verifica se a resposta foi Ok
        throw new Error("Erro ao salvar o endereço"); // Erro se falhar
      }

      // Converte a resposta da req. para JSON
      const result = await response.json();
      alert(result.message); // Exibe a msg de sucesso retornada do back-end

      // Limpa os campos do formulário após o envio ao banco de dados
      document.getElementById("adressForm").reset();

      // Remove o Feedback visual (Borda Colorida)
      document.querySelectorAll(".form-group input").forEach((input) => {
        input.style.borderColor = "#ddd"; // Define a borda de volta para o padrão
      });
    } catch (error) {
      console.error("Erro ao salvar o endereço:", error); // Exibe erro no console
      alert(
        "Erro ao salvar o endereço. Verifique o console para mais detalhes."
      );
    }
  });
