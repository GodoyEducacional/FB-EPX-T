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
    document.querySelectorAll('.form-group input').forEach(input => {
        input.style.borderColor = '#6a11cb' // Define cor roxa ao CEP for encontrado
    })
  } catch (error) {
    console.error('Erro ao buscar o CEP:', error) // Exibe o erro no console
    alert('Erro ao buscar o CEP. Verifique o console!')
  }
});
