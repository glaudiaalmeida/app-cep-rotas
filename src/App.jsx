import { useState } from 'react';
import './App.css';


function App() {
  const [cep, setCep] = useState("");  // Estado para armazenar o CEP que está sendo digitado
  const [cepsList, setCepsList] = useState([]); // Estado para armazenar a lista de CEPs

  const handleInputChange = (e) => {
    setCep(e.target.value); // Atualiza o estado do CEP
  };

  const buscarCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
      if (!response.ok) {
        throw new Error('Erro ao buscar o CEP');
      }
      const data = await response.json();
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }
      return {
        cep: data.cep,
        rua: data.logradouro,
        cidade: data.localidade
      };
    } catch (error) {
      alert(`Erro ao buscar o CEP: ${error.message}`);
      return null;
    }
  };

  const handleAdicionarCep = async () => {
    if (cep.trim() !== "") {
      const dadosCep = await buscarCep(cep.trim());
      if (dadosCep) {
        setCepsList([...cepsList, dadosCep]);
        setCep("");
      }
    }
  };

  const handleExcluirCep = (indexToRemove) => {
    const novaLista = cepsList.filter((_, index) => index !== indexToRemove);
    setCepsList(novaLista);
  };

  const handleExcluirTudo = () => {
    setCepsList([]);
    setCep(""); // Limpa o campo de entrada de CEP
    alert("Todos os CEP's foram excluídos!"); // Alerta ao excluir todos os CEPs    

  };

  const handleOrdenar = () => {
    const cepsOrdenados = [...cepsList].sort((a, b) => a.cep.localeCompare(b.cep)); // Cria uma cópia da lista e ordena
    setCepsList(cepsOrdenados); // Atualiza a lista ordenada
  };

  
  const handleSalvarLista = () => {
    const cepsOrdenados = [...cepsList].sort((a, b) => a.cep.localeCompare(b.cep)); // Ordena a lista antes de salvar
    const cepsFormatados = cepsOrdenados.map((cep) => `${item.cep} - ${item.rua}, ${item.cidade}`);
    setCepsList(cepsOrdenados);
    const blob = new Blob([cepsFormatados.join('\n')], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ceps_ordenados.txt';
    link.click();
  };

  return (
    <div className="App">
      <div className="header">
        <h2>Ordenador de CEP's</h2>
      </div> 
      <div className="text-boasvindas">   
        <p>Insira os CEP's e clique em "Ordenar" para colocar em ordem.</p>
        
      </div> 
      <div className="inserir-cep">
        <h3>Digite os CEPs que deseja ordenar</h3>
        {/* Campo de entrada para o CEP */}
        <input
          type="text" 
          value={cep} 
          onChange={handleInputChange} 
          placeholder="Digite um CEP - Formato: 12345-678" // Placeholder para o campo de entrada
          className="input-cep"
          maxLength="9" // Limita o tamanho do CEP para 8 caracteres
          pattern="\d{5}-?\d{3}" // Regex para validar o formato do CEP
          title="Formato: 12345-678" // Mensagem de ajuda para o usuário
          required // Campo obrigatório
          onInvalid={(e) => e.target.setCustomValidity("Formato inválido. Use 12345-678")} // Mensagem de erro personalizada
          onInput={(e) => e.target.setCustomValidity("")} // Limpa a mensagem de erro quando o usuário começa a digitar
          onFocus={(e) => e.target.placeholder = "Digite um CEP - Formato: 12345-678"} // Altera o placeholder ao focar
          onBlur={(e) => e.target.placeholder = "Digite um CEP - Formato: 12345-678"} // Restaura o placeholder ao desfocar
      
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && cep.length > 0) {
              setCep(cep.slice(0, -1)); // Remove o último caractere ao pressionar Backspace
            }
          }} // Remove o último caractere ao pressionar Backspace
          onPaste={(e) => {
            e.preventDefault(); // Previne o comportamento padrão de colar
            const pastedData = e.clipboardData.getData('text'); // Obtém os dados colados
            if (/^\d{5}-?\d{3}$/.test(pastedData)) { // Verifica se o formato é válido
              setCep(pastedData); // Define o CEP se o formato for válido
            } else {
              alert("Formato inválido. Use 12345-678"); // Alerta se o formato for inválido
            }
          }} // Previne colar formatos inválidos
          onCut={(e) => {
            e.preventDefault(); // Previne o comportamento padrão de cortar
            const cutData = cep.slice(0, -1); // Remove o último caractere
            setCep(cutData); // Atualiza o estado do CEP
          }} // Remove o último caractere ao cortar
          onCopy={(e) => {
            e.preventDefault(); // Previne o comportamento padrão de copiar
            const copyData = cep; // Obtém o CEP atual
            navigator.clipboard.writeText(copyData); // Copia o CEP para a área de transferência
          }} // Copia o CEP atual ao pressionar Ctrl+C
          onDrag={(e) => {
            e.preventDefault(); // Previne o comportamento padrão de arrastar
            const dragData = cep; // Obtém o CEP atual
            navigator.clipboard.writeText(dragData); // Copia o CEP para a área de transferência
          }} // Copia o CEP atual ao arrastar
          onDrop={(e) => {
            e.preventDefault(); // Previne o comportamento padrão de soltar
            const dropData = e.dataTransfer.getData('text'); // Obtém os dados arrastados
            if (/^\d{5}-?\d{3}$/.test(dropData)) { // Verifica se o formato é válido
              setCep(dropData); // Define o CEP se o formato for válido
            } else {
              alert("Formato inválido. Use 12345-678"); // Alerta se o formato for inválido
            }
          }} // Previne soltar formatos inválidos
        
        />
     
      </div>
      <div className="cep-enviar-finalizar">
          <button className="button-enviar" onClick={handleAdicionarCep}>Enviar</button>
          <button className="button-ordenar" onClick={handleOrdenar} disabled={cepsList.length === 0}>
            Ordenar</button>
      </div>

      <div className="lista-cep">
        <h2>Relação Ordenada de CEP's</h2>
        <ul>
          {cepsList.map((item, index) => (
           
            <li key={index}>
              <span>{item.cep} - {item.rua}, {item.cidade}</span>
              {/* Botão para excluir o CEP da lista */} 
              <button className="button-excluir-cep" onClick={() => handleExcluirCep(index)}>Excluir</button>
            </li>
          ))}
        </ul>
        {cepsList.length > 0 && (
          <p><strong>Total de CEP's inseridos:</strong> {cepsList.length}</p>
        )}
        <div className="cep-salvar-excluir-tudo">
          <button className="button-salvar-lista" onClick={handleSalvarLista}>Salvar</button>
          <button className="button-excluir-tudo" onClick={() => handleExcluirTudo(index)} style={{ marginLeft: '10px' }}>
                  Excluir Tudo
                </button>
      </div>
       
        <h2>Boa entrega!</h2>
        
      </div>
      <div className="footer">
        <p>Desenvolvido por: Gláudia Almeida - Data: {new Date().toLocaleDateString()} - v. 1.0</p>
      </div>
    </div>
  )
}

export default App;