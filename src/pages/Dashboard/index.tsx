import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Header } from '../../components/Header';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface Food{
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState<Food>();
  const [modalIsOpen, setModaIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);

  useEffect(() => {
    const getFoods = async () => {
      const response = await api.get('/foods')
      setFoods(response.data)
    }
    getFoods();
  }, []);

  const handleAddFood = async (food: Food) => {
    try {
      const response = await api.post<Food>('/foods', {
        ...food,
        available: true,
      });
      setFoods([
        ...foods,
        response.data
      ])
    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateFood = async (food: Food) => {
    if (!editingFood) {
      return;
    }
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered);
  }

  const toggleModal = () => {
    setModaIsOpen(!modalIsOpen)
  }

  const toggleEditModal = () => {
    setEditModalIsOpen(!editModalIsOpen)
  }

  const handleEditFood = (food: Food) => {
    setEditingFood(food)
    setEditModalIsOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalIsOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalIsOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};