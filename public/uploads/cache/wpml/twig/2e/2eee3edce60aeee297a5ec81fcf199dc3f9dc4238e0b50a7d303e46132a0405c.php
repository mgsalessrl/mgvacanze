<?php

namespace WPML\Core;

use \WPML\Core\Twig\Environment;
use \WPML\Core\Twig\Error\LoaderError;
use \WPML\Core\Twig\Error\RuntimeError;
use \WPML\Core\Twig\Markup;
use \WPML\Core\Twig\Sandbox\SecurityError;
use \WPML\Core\Twig\Sandbox\SecurityNotAllowedTagError;
use \WPML\Core\Twig\Sandbox\SecurityNotAllowedFilterError;
use \WPML\Core\Twig\Sandbox\SecurityNotAllowedFunctionError;
use \WPML\Core\Twig\Source;
use \WPML\Core\Twig\Template;

/* multilingual.twig */
class __TwigTemplate_74f8a5b72892239beca798845ec8f314996cd808d09d17f6181c78371ac926c1 extends \WPML\Core\Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        echo "
";
        // line 2
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["menu"] ?? null));
        foreach ($context['_seq'] as $context["_key"] => $context["menuItem"]) {
            // line 3
            echo "
    <div class=\"info-wrap\">
        <a href=\"";
            // line 5
            echo \WPML\Core\twig_escape_filter($this->env, $this->getAttribute($this->getAttribute($context["menuItem"], "button", []), "url", []), "html", null, true);
            echo "\" class=\"info-content-wrap\" aria-label=\"";
            echo \WPML\Core\twig_escape_filter($this->env, $this->getAttribute($this->getAttribute($context["menuItem"], "button", []), "label", []), "html", null, true);
            echo "\">
            ";
            // line 6
            if (($this->getAttribute($context["menuItem"], "icon", []) == "otgs-ico-tag")) {
                // line 7
                echo "                <span class=\"otgs-ico ";
                echo \WPML\Core\twig_escape_filter($this->env, $this->getAttribute($context["menuItem"], "icon", []), "html", null, true);
                echo "\">
                    <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" fill=\"none\"><path fill=\"#33879E\" fill-rule=\"evenodd\" d=\"M11.333 6a2.667 2.667 0 1 1 5.334 0 2.667 2.667 0 0 1-5.334 0ZM14 7.333a1.333 1.333 0 1 1 0-2.666 1.333 1.333 0 0 1 0 2.666Z\" clip-rule=\"evenodd\"/><path fill=\"#33879E\" fill-rule=\"evenodd\" d=\"M19.233.1h-8.957a.667.667 0 0 0-.471.196L.572 9.529a.667.667 0 0 0 0 .942l8.957 8.957c.26.26.682.26.942 0l9.233-9.233a.667.667 0 0 0 .195-.471V.767a.667.667 0 0 0-.666-.666ZM1.986 10l8.566-8.566h8.014v8.014L10 18.014 1.986 10Z\" clip-rule=\"evenodd\"/></svg>
                </span>
            ";
            } else {
                // line 11
                echo "                <span class=\"otgs-ico ";
                echo \WPML\Core\twig_escape_filter($this->env, $this->getAttribute($context["menuItem"], "icon", []), "html", null, true);
                echo "\"></span>
            ";
            }
            // line 13
            echo "            <span class=\"info-content\">
                <h3 class=\"heading\">";
            // line 14
            echo \WPML\Core\twig_escape_filter($this->env, $this->getAttribute($context["menuItem"], "title", []), "html", null, true);
            echo "</h3>
                <span>";
            // line 15
            echo $this->getAttribute($context["menuItem"], "description", []);
            echo "</span>

                <span class=\"button-primary\" >";
            // line 17
            echo \WPML\Core\twig_escape_filter($this->env, $this->getAttribute($this->getAttribute($context["menuItem"], "button", []), "label", []), "html", null, true);
            echo "</span>

            </span>
        </a>
    </div>

";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['menuItem'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 24
        echo "
<div id=\"translate_manually\" class=\"translate-manually\">
    <button
        aria-expanded=\"false\"
        aria-controls=\"translate_manually_wrapper\"
        id=\"translate_manually_toggle\"
    >
        <span>";
        // line 31
        echo \WPML\Core\twig_escape_filter($this->env, $this->getAttribute(($context["translate_manually"] ?? null), "toggle_text", []), "html", null, true);
        echo "</span>
    </button>

    <div
        role=\"region\"
        aria-labelledby=\"translate_manually_toggle\"
        class=\"steps\"
        id=\"translate_manually_wrapper\"
    >
        <ul>
            <li>";
        // line 41
        echo $this->getAttribute(($context["translate_manually"] ?? null), "products", []);
        echo "</li>
            <li>";
        // line 42
        echo $this->getAttribute(($context["translate_manually"] ?? null), "product_categories", []);
        echo "</li>
        </ul>
    </div>
</div>

";
    }

    public function getTemplateName()
    {
        return "multilingual.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  116 => 42,  112 => 41,  99 => 31,  90 => 24,  77 => 17,  72 => 15,  68 => 14,  65 => 13,  59 => 11,  51 => 7,  49 => 6,  43 => 5,  39 => 3,  35 => 2,  32 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "multilingual.twig", "/home/customer/www/mgvacanze.com/public_html/wp-content/plugins/woocommerce-multilingual/templates/multilingual/multilingual.twig");
    }
}
