import IngredientsTable from "@/src/components/UI/tables/ingredients"
import IngredientForm from "@/src/forms/ingredient.form"

const IngredientsPage = () => {
    return (
        <div>
            <IngredientForm />
            <IngredientsTable />
        </div>
    )

}

export default IngredientsPage
